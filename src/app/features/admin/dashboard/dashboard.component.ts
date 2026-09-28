import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { AdminService, AdminContactMessage } from '../../../core/services/admin.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ProjectCard } from '../../../core/models/project.model';
import { SkillCategoryGroup, SkillCategory } from '../../../core/models/skill.model';
import { PublicSettings } from '../../../core/models/settings.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, IconComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly apiService = inject(ApiService);
  private readonly adminService = inject(AdminService);
  private readonly fb = inject(FormBuilder);

  readonly activeTab = signal<'overview' | 'messages' | 'projects' | 'skills' | 'settings'>('overview');

  // Data signals
  readonly messages = signal<AdminContactMessage[]>([]);
  readonly projects = signal<ProjectCard[]>([]);
  readonly skillGroups = signal<SkillCategoryGroup[]>([]);
  readonly settings = signal<PublicSettings | null>(null);

  // Modal & Form states
  readonly isProjectModalOpen = signal(false);
  readonly isSkillModalOpen = signal(false);
  readonly isSaving = signal(false);
  readonly actionMessage = signal<string | null>(null);

  // Forms
  projectForm!: FormGroup;
  skillForm!: FormGroup;
  settingsForm!: FormGroup;

  ngOnInit(): void {
    this.initForms();
    this.loadAllData();
  }

  private initForms(): void {
    this.projectForm = this.fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(150)]],
      slug: ['', [Validators.required, Validators.maxLength(160)]],
      summary: ['', [Validators.required, Validators.maxLength(500)]],
      problemStatement: [''],
      solutionStatement: [''],
      architectureOverview: [''],
      keyMetrics: [''],
      lessonsLearned: [''],
      thumbnailUrl: [''],
      liveUrl: [''],
      githubUrl: [''],
      techStack: [''],
      isFeatured: [false],
      isCaseStudy: [false],
      displayOrder: [0],
    });

    this.skillForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      category: [1, [Validators.required]],
      iconKey: [''],
      proficiency: [90, [Validators.required, Validators.min(1), Validators.max(100)]],
      isTopSkill: [false],
      displayOrder: [0],
    });

    this.settingsForm = this.fb.group({
      fullName: ['', Validators.required],
      professionalTitle: ['', Validators.required],
      oneLineBio: ['', Validators.required],
      aboutSummary: [''],
      availabilityStatus: ['', Validators.required],
      currentLocation: ['', Validators.required],
      cvUrl: [''],
    });
  }

  loadAllData(): void {
    this.apiService.getProjects().subscribe({
      next: (res) => {
        if (res.data) this.projects.set(res.data);
      },
    });

    this.apiService.getSkills().subscribe({
      next: (res) => {
        if (res.data) this.skillGroups.set(res.data);
      },
    });

    this.apiService.getPublicSettings().subscribe({
      next: (res) => {
        if (res.data) {
          this.settings.set(res.data);
          this.settingsForm.patchValue(res.data);
        }
      },
    });

    this.adminService.getMessages().subscribe({
      next: (res) => {
        if (res.data) this.messages.set(res.data);
      },
      error: () => {},
    });
  }

  setTab(tab: 'overview' | 'messages' | 'projects' | 'skills' | 'settings'): void {
    this.activeTab.set(tab);
    this.actionMessage.set(null);
  }

  // --- Messages Actions ---
  markAsRead(id: string): void {
    this.adminService.markMessageAsRead(id).subscribe({
      next: () => {
        this.messages.update((list) =>
          list.map((m) => (m.id === id ? { ...m, isRead: true } : m))
        );
      },
    });
  }

  deleteMessage(id: string): void {
    if (!confirm('Are you sure you want to delete this message?')) return;
    this.adminService.deleteMessage(id).subscribe({
      next: () => {
        this.messages.update((list) => list.filter((m) => m.id !== id));
      },
    });
  }

  // --- Project Modal & Actions ---
  openNewProjectModal(): void {
    this.projectForm.reset({
      id: '',
      isFeatured: false,
      isCaseStudy: false,
      displayOrder: this.projects().length + 1,
    });
    this.isProjectModalOpen.set(true);
  }

  saveProject(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const formVal = this.projectForm.value;
    const techArray = formVal.techStack
      ? formVal.techStack.split(',').map((t: string) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      ...formVal,
      techStackJson: JSON.stringify(techArray),
    };

    if (formVal.id) {
      this.adminService.updateProject(formVal.id, payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isProjectModalOpen.set(false);
          this.showNotice('Project updated successfully.');
          this.loadAllData();
        },
        error: () => this.isSaving.set(false),
      });
    } else {
      this.adminService.createProject(payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isProjectModalOpen.set(false);
          this.showNotice('Project created successfully.');
          this.loadAllData();
        },
        error: () => this.isSaving.set(false),
      });
    }
  }

  deleteProject(id: string): void {
    if (!confirm('Delete this project permanently?')) return;
    this.adminService.deleteProject(id).subscribe({
      next: () => {
        this.showNotice('Project deleted.');
        this.projects.update((list) => list.filter((p) => p.id !== id));
      },
    });
  }

  // --- Skill Modal & Actions ---
  openNewSkillModal(): void {
    this.skillForm.reset({
      category: 1,
      proficiency: 90,
      isTopSkill: false,
      displayOrder: 1,
    });
    this.isSkillModalOpen.set(true);
  }

  saveSkill(): void {
    if (this.skillForm.invalid) {
      this.skillForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const payload = this.skillForm.value;

    this.adminService.createSkill(payload).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.isSkillModalOpen.set(false);
        this.showNotice('Skill added successfully.');
        this.loadAllData();
      },
      error: () => this.isSaving.set(false),
    });
  }

  deleteSkill(id: string): void {
    if (!confirm('Delete this skill?')) return;
    this.adminService.deleteSkill(id).subscribe({
      next: () => {
        this.showNotice('Skill deleted.');
        this.loadAllData();
      },
    });
  }

  // --- Settings Actions ---
  saveSettings(): void {
    if (this.settingsForm.invalid) return;

    this.isSaving.set(true);
    const val = this.settingsForm.value;
    const payload = {
      ...val,
      socialLinks: this.settings()?.socialLinks || [],
    };

    this.adminService.updateSettings(payload).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.showNotice('Settings updated successfully.');
      },
      error: () => this.isSaving.set(false),
    });
  }

  onCvSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.adminService.uploadCv(file).subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.settingsForm.patchValue({ cvUrl: res.data });
            this.showNotice('CV uploaded successfully.');
          }
        },
      });
    }
  }

  private showNotice(msg: string): void {
    this.actionMessage.set(msg);
    setTimeout(() => this.actionMessage.set(null), 4000);
  }
}
