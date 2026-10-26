import { Component, OnInit, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { SkillCategoryGroup } from '../../core/models/skill.model';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly seoService = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly skillGroups = signal<SkillCategoryGroup[]>([]);
  readonly isLoading = signal(true);

  ngOnInit(): void {
    this.seoService.updateMeta({
      title: 'Technical Skills & Architecture Matrix',
      description:
        'Detailed breakdown of technical competencies, design patterns, and engineering frameworks utilized by Shahid Hussain across .NET and Angular.',
    });

    if (isPlatformBrowser(this.platformId)) {
      try {
        const cached = sessionStorage.getItem('shahid_cached_all_skills');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.skillGroups.set(parsed);
            this.isLoading.set(false);
          }
        }
      } catch {}
    }

    this.loadSkills();
  }

  getProficiencyLabel(proficiency: number): string {
    if (proficiency >= 90) return 'Core Expertise';
    if (proficiency >= 80) return 'Proficient';
    return 'Familiar';
  }

  private loadSkills(): void {
    this.apiService.getSkills().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.data) {
          this.skillGroups.set(res.data);
          if (isPlatformBrowser(this.platformId)) {
            try { sessionStorage.setItem('shahid_cached_all_skills', JSON.stringify(res.data)); } catch {}
          }
        }
      },
      error: () => this.isLoading.set(false),
    });
  }
}
