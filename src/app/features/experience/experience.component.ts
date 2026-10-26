import { Component, OnInit, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ExperienceItem, EducationItem } from '../../core/models/timeline.model';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
})
export class ExperienceComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly seoService = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly experiences = signal<ExperienceItem[]>([]);
  readonly educations = signal<EducationItem[]>([]);
  readonly isLoading = signal(true);

  ngOnInit(): void {
    this.seoService.updateMeta({
      title: 'Work Experience & Education Timeline',
      description:
        'Professional work history, enterprise roles, quantified engineering achievements, and educational background of Shahid Hussain.',
    });

    if (isPlatformBrowser(this.platformId)) {
      try {
        const cached = sessionStorage.getItem('shahid_cached_timeline');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.experiences && parsed.experiences.length > 0) {
            this.experiences.set(parsed.experiences);
          }
          if (parsed.educations && parsed.educations.length > 0) {
            this.educations.set(parsed.educations);
          }
          this.isLoading.set(false);
        }
      } catch {}
    }

    this.loadTimeline();
  }

  private loadTimeline(): void {
    this.apiService.getTimeline().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.data) {
          if (res.data.experiences) {
            this.experiences.set(res.data.experiences);
          }
          if (res.data.educations) {
            this.educations.set(res.data.educations);
          }
          if (isPlatformBrowser(this.platformId)) {
            try { sessionStorage.setItem('shahid_cached_timeline', JSON.stringify(res.data)); } catch {}
          }
        }
      },
      error: () => this.isLoading.set(false),
    });
  }
}
