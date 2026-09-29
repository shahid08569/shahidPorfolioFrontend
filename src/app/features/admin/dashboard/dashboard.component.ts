import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { AdminService, AdminContactMessage } from '../../../core/services/admin.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { ProjectCard } from '../../../core/models/project.model';
import { SkillCategoryGroup, SkillCategory } from '../../../core/models/skill.model';
import { PublicSettings } from '../../../core/models/settings.model';
import { Testimonial } from '../../../core/models/testimonial.model';
import { Certificate } from '../../../core/models/certificate.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    IconComponent,
    ConfirmModalComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly apiService = inject(ApiService);
  private readonly adminService = inject(AdminService);
  private readonly fb = inject(FormBuilder);

  readonly activeTab = signal<'overview' | 'messages' | 'projects' | 'skills' | 'testimonials' | 'certificates' | 'settings'>('overview');

  // Data signals
  readonly messages = signal<AdminContactMessage[]>([]);
  readonly projects = signal<ProjectCard[]>([]);
  readonly skillGroups = signal<SkillCategoryGroup[]>([]);
  readonly testimonials = signal<Testimonial[]>([]);
  readonly certificates = signal<Certificate[]>([]);
  readonly settings = signal<PublicSettings | null>(null);

  // Modals & Action states
  readonly isProjectModalOpen = signal(false);
  readonly isSkillModalOpen = signal(false);
  readonly isTestimonialModalOpen = signal(false);
  readonly isCertificateModalOpen = signal(false);
  readonly isMessageViewModalOpen = signal(false);
  readonly selectedMessage = signal<AdminContactMessage | null>(null);

  readonly isSaving = signal(false);
  readonly isUploadingCv = signal(false);
  readonly cvSuccessMessage = signal<string | null>(null);
  readonly actionMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  // Confirm Modal state
  readonly confirmModal = signal<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    isDanger: boolean;
    isLoading: boolean;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Delete',
    isDanger: true,
    isLoading: false,
    action: () => {},
  });

  // Selected CV file
  selectedCvFile: File | null = null;

  // Forms
  projectForm!: FormGroup;
  skillForm!: FormGroup;
  testimonialForm!: FormGroup;
  certificateForm!: FormGroup;
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
      id: [''],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      category: [1, [Validators.required]],
      iconKey: [''],
      proficiency: [90, [Validators.required, Validators.min(1), Validators.max(100)]],
      isTopSkill: [false],
      displayOrder: [0],
    });

    this.testimonialForm = this.fb.group({
      id: [''],
      clientName: ['', [Validators.required, Validators.maxLength(100)]],
      role: ['', [Validators.required, Validators.maxLength(100)]],
      company: ['', [Validators.required, Validators.maxLength(100)]],
      avatarUrl: [''],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
      linkedInUrl: [''],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      relationship: ['Client'],
      isApproved: [true],
      displayOrder: [0],
    });

    this.certificateForm = this.fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(150)]],
      issuingOrganization: ['', [Validators.required, Validators.maxLength(150)]],
      issueDate: [new Date().toISOString().substring(0, 10), Validators.required],
      expirationDate: [''],
      credentialId: [''],
      credentialUrl: [''],
      imageUrl: [''],
      displayOrder: [0],
      isActive: [true],
    });

    this.settingsForm = this.fb.group({
      fullName: ['', Validators.required],
      professionalTitle: ['', Validators.required],
      oneLineBio: ['', Validators.required],
      aboutSummary: [''],
      availabilityStatus: ['', Validators.required],
      currentLocation: ['', Validators.required],
      cvUrl: [''],
      whatsAppNumber: ['923000000000', Validators.required],
      heroCodeTitle: ['ShahidPortfolio.sln - Clean Architecture', Validators.required],
      heroCodeSnippet: ['', Validators.required],
      heroBadges: ['Clean Architecture, CQRS / MediatR, Angular 22 Signals', Validators.required],
    });
  }

  loadAllData(): void {
    // 1. Projects
    this.apiService.getProjects().subscribe({
      next: (res) => {
        if (res.data) this.projects.set(res.data);
      },
    });

    // 2. Skills
    this.apiService.getSkills().subscribe({
      next: (res) => {
        if (res.data) this.skillGroups.set(res.data);
      },
    });

    // 3. Settings
    this.apiService.getPublicSettings().subscribe({
      next: (res) => {
        if (res.data) {
          this.settings.set(res.data);
          let badgesStr = 'Clean Architecture, CQRS / MediatR, Angular 22 Signals';
          try {
            if (res.data.heroBadgesJson) {
              const parsed = JSON.parse(res.data.heroBadgesJson);
              if (Array.isArray(parsed)) badgesStr = parsed.join(', ');
            }
          } catch {}

          this.settingsForm.patchValue({
            fullName: res.data.fullName,
            professionalTitle: res.data.professionalTitle,
            oneLineBio: res.data.oneLineBio,
            aboutSummary: res.data.aboutSummary,
            availabilityStatus: res.data.availabilityStatus,
            currentLocation: res.data.currentLocation,
            cvUrl: res.data.cvUrl,
            whatsAppNumber: res.data.whatsAppNumber || '923000000000',
            heroCodeTitle: res.data.heroCodeTitle || 'ShahidPortfolio.sln - Clean Architecture',
            heroCodeSnippet: res.data.heroCodeSnippet || '',
            heroBadges: badgesStr,
          });
        }
      },
    });

    // 4. Messages
    this.adminService.getMessages().subscribe({
      next: (res) => {
        if (res.data) this.messages.set(res.data);
      },
    });

    // 5. Testimonials
    this.adminService.getAllTestimonials().subscribe({
      next: (res) => {
        if (res.data) this.testimonials.set(res.data as Testimonial[]);
      },
    });

    // 6. Certificates
    this.adminService.getAllCertificates().subscribe({
      next: (res) => {
        if (res.data) this.certificates.set(res.data as Certificate[]);
      },
    });
  }

  setTab(tab: 'overview' | 'messages' | 'projects' | 'skills' | 'testimonials' | 'certificates' | 'settings'): void {
    this.activeTab.set(tab);
    this.actionMessage.set(null);
    this.errorMessage.set(null);
  }

  // ==========================================
  // CONFIRM MODAL SYSTEM
  // ==========================================
  triggerConfirm(title: string, message: string, action: () => void, confirmText = 'Delete Permanently', isDanger = true): void {
    this.confirmModal.set({
      isOpen: true,
      title,
      message,
      confirmText,
      isDanger,
      isLoading: false,
      action,
    });
  }

  executeConfirm(): void {
    const current = this.confirmModal();
    if (current.action) {
      this.confirmModal.update((s) => ({ ...s, isLoading: true }));
      current.action();
    }
  }

  closeConfirmModal(): void {
    this.confirmModal.set({
      isOpen: false,
      title: '',
      message: '',
      confirmText: 'Delete',
      isDanger: true,
      isLoading: false,
      action: () => {},
    });
  }

  // ==========================================
  // PROJECTS MANAGEMENT
  // ==========================================
  openNewProjectModal(): void {
    this.projectForm.reset({
      id: '',
      title: '',
      slug: '',
      summary: '',
      problemStatement: '',
      solutionStatement: '',
      architectureOverview: '',
      keyMetrics: '',
      lessonsLearned: '',
      thumbnailUrl: '',
      liveUrl: '',
      githubUrl: '',
      techStack: '',
      isFeatured: false,
      isCaseStudy: false,
      displayOrder: this.projects().length + 1,
    });
    this.isProjectModalOpen.set(true);
  }

  openEditProjectModal(project: ProjectCard): void {
    const stackStr = project.techStack ? project.techStack.join(', ') : '';
    this.projectForm.patchValue({
      id: project.id,
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      problemStatement: project.problemStatement || '',
      solutionStatement: project.solutionStatement || '',
      architectureOverview: project.architectureOverview || '',
      keyMetrics: project.keyMetrics || '',
      lessonsLearned: project.lessonsLearned || '',
      thumbnailUrl: project.thumbnailUrl || '',
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      techStack: stackStr,
      isFeatured: project.isFeatured,
      isCaseStudy: project.isCaseStudy,
      displayOrder: project.displayOrder,
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
        error: (err) => {
          this.isSaving.set(false);
          this.showError(err?.error?.message || 'Failed to update project.');
        },
      });
    } else {
      this.adminService.createProject(payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isProjectModalOpen.set(false);
          this.showNotice('Project created successfully.');
          this.loadAllData();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.showError(err?.error?.message || 'Failed to create project.');
        },
      });
    }
  }

  confirmDeleteProject(project: ProjectCard): void {
    this.triggerConfirm(
      'Delete Project',
      `Are you sure you want to permanently delete "${project.title}"? This cannot be undone.`,
      () => {
        this.adminService.deleteProject(project.id).subscribe({
          next: () => {
            this.closeConfirmModal();
            this.showNotice('Project deleted.');
            this.loadAllData();
          },
          error: (err) => {
            this.closeConfirmModal();
            this.showError(err?.error?.message || 'Failed to delete project.');
          },
        });
      }
    );
  }

  // ==========================================
  // SKILLS MANAGEMENT
  // ==========================================
  openNewSkillModal(): void {
    this.skillForm.reset({
      id: '',
      name: '',
      category: 1,
      iconKey: '',
      proficiency: 90,
      isTopSkill: false,
      displayOrder: 1,
    });
    this.isSkillModalOpen.set(true);
  }

  openEditSkillModal(skill: any, category: number): void {
    this.skillForm.patchValue({
      id: skill.id,
      name: skill.name,
      category: category,
      iconKey: skill.iconKey || skill.icon || '',
      proficiency: skill.proficiency,
      isTopSkill: skill.isTopSkill || false,
      displayOrder: skill.displayOrder || 0,
    });
    this.isSkillModalOpen.set(true);
  }

  saveSkill(): void {
    if (this.skillForm.invalid) {
      this.skillForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const formVal = this.skillForm.value;

    if (formVal.id) {
      this.adminService.updateSkill(formVal.id, formVal).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isSkillModalOpen.set(false);
          this.showNotice('Skill updated successfully.');
          this.loadAllData();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.showError(err?.error?.message || 'Failed to update skill.');
        },
      });
    } else {
      this.adminService.createSkill(formVal).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isSkillModalOpen.set(false);
          this.showNotice('Skill added successfully.');
          this.loadAllData();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.showError(err?.error?.message || 'Failed to add skill.');
        },
      });
    }
  }

  confirmDeleteSkill(skill: any): void {
    this.triggerConfirm(
      'Delete Skill',
      `Are you sure you want to delete "${skill.name}" from your skills matrix?`,
      () => {
        this.adminService.deleteSkill(skill.id).subscribe({
          next: () => {
            this.closeConfirmModal();
            this.showNotice('Skill deleted.');
            this.loadAllData();
          },
          error: (err) => {
            this.closeConfirmModal();
            this.showError(err?.error?.message || 'Failed to delete skill.');
          },
        });
      }
    );
  }

  // ==========================================
  // TESTIMONIALS / ENDORSEMENTS MANAGEMENT
  // ==========================================
  openNewTestimonialModal(): void {
    this.testimonialForm.reset({
      id: '',
      clientName: '',
      role: '',
      company: '',
      avatarUrl: '',
      content: '',
      linkedInUrl: '',
      rating: 5,
      relationship: 'Client / Business Partner',
      isApproved: true,
      displayOrder: this.testimonials().length + 1,
    });
    this.isTestimonialModalOpen.set(true);
  }

  openEditTestimonialModal(item: Testimonial): void {
    this.testimonialForm.patchValue({
      id: item.id,
      clientName: item.clientName,
      role: item.role,
      company: item.company,
      avatarUrl: item.avatarUrl || '',
      content: item.content,
      linkedInUrl: item.linkedInUrl || '',
      rating: item.rating || 5,
      relationship: item.relationship || 'Client',
      isApproved: item.isApproved,
      displayOrder: item.displayOrder,
    });
    this.isTestimonialModalOpen.set(true);
  }

  saveTestimonial(): void {
    if (this.testimonialForm.invalid) {
      this.testimonialForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const formVal = this.testimonialForm.value;

    if (formVal.id) {
      this.adminService.updateTestimonial(formVal.id, formVal).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isTestimonialModalOpen.set(false);
          this.showNotice('Endorsement updated successfully.');
          this.loadAllData();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.showError(err?.error?.message || 'Failed to update endorsement.');
        },
      });
    } else {
      this.adminService.createTestimonial(formVal).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isTestimonialModalOpen.set(false);
          this.showNotice('Endorsement created successfully.');
          this.loadAllData();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.showError(err?.error?.message || 'Failed to create endorsement.');
        },
      });
    }
  }

  toggleTestimonialApproval(item: Testimonial): void {
    if (item.isApproved) {
      this.adminService.rejectTestimonial(item.id).subscribe({
        next: () => {
          this.showNotice(`Unapproved "${item.clientName}" review.`);
          this.loadAllData();
        },
      });
    } else {
      this.adminService.approveTestimonial(item.id).subscribe({
        next: () => {
          this.showNotice(`Approved "${item.clientName}" review. Now live on site!`);
          this.loadAllData();
        },
      });
    }
  }

  confirmDeleteTestimonial(item: Testimonial): void {
    this.triggerConfirm(
      'Delete Endorsement',
      `Delete feedback from "${item.clientName}" permanently?`,
      () => {
        this.adminService.deleteTestimonial(item.id).subscribe({
          next: () => {
            this.closeConfirmModal();
            this.showNotice('Endorsement removed.');
            this.loadAllData();
          },
          error: (err) => {
            this.closeConfirmModal();
            this.showError(err?.error?.message || 'Failed to delete endorsement.');
          },
        });
      }
    );
  }

  // ==========================================
  // CERTIFICATES MANAGEMENT
  // ==========================================
  openNewCertificateModal(): void {
    this.certificateForm.reset({
      id: '',
      title: '',
      issuingOrganization: '',
      issueDate: new Date().toISOString().substring(0, 10),
      expirationDate: '',
      credentialId: '',
      credentialUrl: '',
      imageUrl: '',
      displayOrder: this.certificates().length + 1,
      isActive: true,
    });
    this.isCertificateModalOpen.set(true);
  }

  openEditCertificateModal(cert: Certificate): void {
    this.certificateForm.patchValue({
      id: cert.id,
      title: cert.title,
      issuingOrganization: cert.issuingOrganization,
      issueDate: cert.issueDate ? cert.issueDate.substring(0, 10) : '',
      expirationDate: cert.expirationDate || '',
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
      imageUrl: cert.imageUrl || '',
      displayOrder: cert.displayOrder,
      isActive: cert.isActive,
    });
    this.isCertificateModalOpen.set(true);
  }

  saveCertificate(): void {
    if (this.certificateForm.invalid) {
      this.certificateForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const formVal = this.certificateForm.value;

    if (formVal.id) {
      this.adminService.updateCertificate(formVal.id, formVal).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isCertificateModalOpen.set(false);
          this.showNotice('Certificate updated successfully.');
          this.loadAllData();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.showError(err?.error?.message || 'Failed to update certificate.');
        },
      });
    } else {
      this.adminService.createCertificate(formVal).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isCertificateModalOpen.set(false);
          this.showNotice('Certificate added successfully.');
          this.loadAllData();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.showError(err?.error?.message || 'Failed to add certificate.');
        },
      });
    }
  }

  confirmDeleteCertificate(cert: Certificate): void {
    this.triggerConfirm(
      'Delete Certificate',
      `Delete "${cert.title}" from your certificates list?`,
      () => {
        this.adminService.deleteCertificate(cert.id).subscribe({
          next: () => {
            this.closeConfirmModal();
            this.showNotice('Certificate deleted.');
            this.loadAllData();
          },
          error: (err) => {
            this.closeConfirmModal();
            this.showError(err?.error?.message || 'Failed to delete certificate.');
          },
        });
      }
    );
  }

  // ==========================================
  // MESSAGES MANAGEMENT
  // ==========================================
  viewMessage(m: AdminContactMessage): void {
    this.selectedMessage.set(m);
    this.isMessageViewModalOpen.set(true);
    if (!m.isRead) {
      this.markAsRead(m.id);
    }
  }

  markAsRead(id: string): void {
    this.adminService.markMessageAsRead(id).subscribe({
      next: () => {
        this.messages.update((list) =>
          list.map((m) => (m.id === id ? { ...m, isRead: true } : m))
        );
      },
    });
  }

  confirmDeleteMessage(m: AdminContactMessage): void {
    this.triggerConfirm(
      'Delete Message',
      `Delete message from "${m.name}"? This cannot be restored.`,
      () => {
        this.adminService.deleteMessage(m.id).subscribe({
          next: () => {
            this.closeConfirmModal();
            this.messages.update((list) => list.filter((item) => item.id !== m.id));
            if (this.selectedMessage()?.id === m.id) {
              this.isMessageViewModalOpen.set(false);
            }
            this.showNotice('Message deleted.');
          },
          error: (err) => {
            this.closeConfirmModal();
            this.showError(err?.error?.message || 'Failed to delete message.');
          },
        });
      }
    );
  }

  // ==========================================
  // SITE SETTINGS & CV UPLOAD
  // ==========================================
  saveSettings(): void {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const formVal = this.settingsForm.value;
    const badgesArray = formVal.heroBadges
      ? formVal.heroBadges.split(',').map((b: string) => b.trim()).filter(Boolean)
      : [];

    const payload = {
      fullName: formVal.fullName,
      professionalTitle: formVal.professionalTitle,
      oneLineBio: formVal.oneLineBio,
      aboutSummary: formVal.aboutSummary || '',
      availabilityStatus: formVal.availabilityStatus,
      currentLocation: formVal.currentLocation,
      cvUrl: formVal.cvUrl || '/uploads/Shahid_Hussain_CV.pdf',
      whatsAppNumber: formVal.whatsAppNumber || '923000000000',
      heroCodeTitle: formVal.heroCodeTitle || 'ShahidPortfolio.sln - Clean Architecture',
      heroCodeSnippet: formVal.heroCodeSnippet || '',
      heroBadgesJson: JSON.stringify(badgesArray),
      socialLinks: (this.settings()?.socialLinks || []).map((s, idx) => ({
        platform: s.platform,
        url: s.url,
        iconKey: s.iconKey,
        displayOrder: idx + 1,
      })),
    };

    this.adminService.updateSettings(payload).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.showNotice('Site settings & Hero terminal updated successfully!');
        this.loadAllData();
      },
      error: (err) => {
        this.isSaving.set(false);
        if (err.status === 401) {
          this.showError('Session expired. Please log in again.');
          this.authService.logout();
        } else if (err.status === 0) {
          this.showError('Cannot connect to backend API. Please make sure the .NET server is running on http://localhost:5272.');
        } else {
          this.showError(err?.error?.message || err?.message || 'Failed to save settings.');
        }
      },
    });
  }

  onCvFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        this.showError('Only PDF files (.pdf) are allowed for the CV.');
        return;
      }
      this.selectedCvFile = file;
    }
  }

  uploadSelectedCv(): void {
    if (!this.selectedCvFile) return;

    this.isUploadingCv.set(true);
    this.adminService.uploadCv(this.selectedCvFile).subscribe({
      next: (res) => {
        this.isUploadingCv.set(false);
        this.selectedCvFile = null;
        const resolvedUrl = this.getCvUrl(res.data || '/uploads/Shahid_Hussain_CV.pdf');
        this.cvSuccessMessage.set('File uploaded and verified! Link: ' + resolvedUrl);
        this.showNotice('CV uploaded successfully! Public link updated.');
        this.loadAllData();
      },
      error: (err) => {
        this.isUploadingCv.set(false);
        this.cvSuccessMessage.set(null);
        if (err.status === 401) {
          this.showError('Session expired. Please log in again.');
          this.authService.logout();
        } else if (err.status === 0) {
          this.showError('Cannot connect to backend API. Please make sure the .NET server is running on http://localhost:5272.');
        } else {
          this.showError(err?.error?.message || err?.message || 'Failed to upload CV.');
        }
      },
    });
  }

  // ==========================================
  // HELPERS
  // ==========================================
  getCvUrl(url: string | undefined | null): string {
    const resolved = this.apiService.resolveMediaUrl(url);
    return resolved || `${environment.apiUrl}/media/cv`;
  }
  getCategoryName(cat: number): string {
    switch (cat) {
      case 1:
        return 'Frontend';
      case 2:
        return 'Backend';
      case 3:
        return 'Database';
      case 4:
        return 'Tools & DevOps';
      case 5:
        return 'Architecture';
      default:
        return 'General';
    }
  }

  private showNotice(msg: string): void {
    this.actionMessage.set(msg);
    this.errorMessage.set(null);
    setTimeout(() => this.actionMessage.set(null), 5000);
  }

  private showError(msg: string): void {
    this.errorMessage.set(msg);
    this.actionMessage.set(null);
    setTimeout(() => this.errorMessage.set(null), 6000);
  }
}
