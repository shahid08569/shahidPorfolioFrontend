import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  readonly searchQuery = signal('');
  readonly selectedCategory = signal('All');

  readonly categories = ['All', 'Full-Stack', '.NET', 'Angular', 'Microservices', 'SQL Server'];

  readonly projects = signal<ProjectCard[]>([
    {
      id: '1',
      title: 'Enterprise Clean Architecture Microservices Platform',
      slug: 'enterprise-clean-architecture-platform',
      summary:
        'A mission-critical event-driven enterprise platform handling high-volume order processing with ASP.NET Core, CQRS via MediatR, and modern Angular frontend.',
      thumbnailUrl: '',
      liveUrl: 'https://demo.shahidhussain.dev',
      githubUrl: 'https://github.com/shahid08569/shahidPorfolioBackend',
      techStackJson: '[]',
      techStack: ['.NET 10', 'ASP.NET Core', 'Angular 22', 'SQL Server', 'MediatR', 'Docker'],
      isFeatured: true,
      isCaseStudy: true,
      displayOrder: 1,
    },
    {
      id: '2',
      title: 'Real-Time Financial Analytics & Trading Engine',
      slug: 'real-time-financial-analytics',
      summary:
        'High-frequency trading telemetry and portfolio risk analytics platform using SignalR streaming, Redis cache, and Angular reactive Signals.',
      thumbnailUrl: '',
      liveUrl: 'https://trade.shahidhussain.dev',
      githubUrl: 'https://github.com/shahid08569/financial-analytics',
      techStackJson: '[]',
      techStack: ['.NET 10', 'SignalR', 'Redis', 'Angular 22', 'TypeScript', 'Tailwind'],
      isFeatured: true,
      isCaseStudy: true,
      displayOrder: 2,
    },
    {
      id: '3',
      title: 'Healthcare EHR & Telemedicine Portal',
      slug: 'healthcare-ehr-telemedicine',
      summary:
        'HIPAA-compliant patient record management and telemedicine scheduling system with multi-tenant database partitioning and JWT role-based security.',
      thumbnailUrl: '',
      liveUrl: 'https://health.shahidhussain.dev',
      githubUrl: 'https://github.com/shahid08569/healthcare-ehr',
      techStackJson: '[]',
      techStack: ['ASP.NET Core', 'EF Core', 'PostgreSQL', 'Angular', 'WebRTC'],
      isFeatured: false,
      isCaseStudy: false,
      displayOrder: 3,
    },
  ]);

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

    this.loadProjects();
  }

  setCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  private loadProjects(): void {
    this.apiService.getProjects().subscribe({
      next: (res) => {
        if (res.data && res.data.length > 0) {
          this.projects.set(res.data);
        }
      },
      error: () => {},
    });
  }
}
