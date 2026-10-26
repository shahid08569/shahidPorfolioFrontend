import { Component, OnInit, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ProjectCard } from '../../core/models/project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, IconComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly seoService = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly searchQuery = signal('');
  readonly selectedCategory = signal('All');
  readonly categories = ['All', 'Full-Stack', '.NET', 'Angular', 'Microservices', 'SQL Server'];

  readonly projects = signal<ProjectCard[]>([]);
  readonly isLoading = signal(true);

  readonly filteredProjects = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const category = this.selectedCategory();

    return this.projects().filter((p) => {
      const matchesCategory =
        category === 'All' ||
        (p.techStack && p.techStack.some((t) => t.toLowerCase().includes(category.toLowerCase()))) ||
        p.title.toLowerCase().includes(category.toLowerCase());

      const matchesQuery =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.summary.toLowerCase().includes(query) ||
        (p.techStack && p.techStack.some((t) => t.toLowerCase().includes(query)));

      return matchesCategory && matchesQuery;
    });
  });

  ngOnInit(): void {
    this.seoService.updateMeta({
      title: 'Enterprise Projects & Case Studies',
      description:
        'Explore real-world software engineering projects, system architectures, and case studies built by Shahid Hussain using .NET and Angular.',
    });

    if (isPlatformBrowser(this.platformId)) {
      try {
        const cached = sessionStorage.getItem('shahid_cached_all_projects');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.projects.set(parsed);
            this.isLoading.set(false);
          }
        }
      } catch {}
    }

    this.loadProjects();
  }

  setCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  private loadProjects(): void {
    this.apiService.getProjects().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.data) {
          this.projects.set(res.data);
          if (isPlatformBrowser(this.platformId)) {
            try { sessionStorage.setItem('shahid_cached_all_projects', JSON.stringify(res.data)); } catch {}
          }
        }
      },
      error: () => this.isLoading.set(false),
    });
  }
}
