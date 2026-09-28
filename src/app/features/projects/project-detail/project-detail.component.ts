import { Component, OnInit, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { SeoService } from '../../../core/services/seo.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ProjectDetail } from '../../../core/models/project.model';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
})
export class ProjectDetailComponent implements OnInit {
  @Input() slug = '';

  private readonly apiService = inject(ApiService);
  private readonly seoService = inject(SeoService);

  readonly project = signal<ProjectDetail>({
    id: '1',
    title: 'Enterprise Clean Architecture Microservices Platform',
    slug: 'enterprise-clean-architecture-platform',
    summary:
      'A mission-critical event-driven enterprise platform handling high-volume order processing with ASP.NET Core, CQRS via MediatR, and modern Angular frontend.',
    problemStatement:
      'The legacy monolithic application suffered from severe database contention during high-concurrency peak events, tightly coupled domain boundaries, and lack of test isolation, causing regression bugs on each deployment.',
    solutionStatement:
      'Engineered an enterprise solution following Clean Architecture principles. Decoupled read and write models using CQRS with MediatR. Introduced SQL Server with optimized indexing, FluentValidation pipeline behaviors, and a modern Angular standalone application with signal-based reactivity.',
    architectureOverview:
      'The system adheres strictly to the Onion / Clean Architecture pattern: Domain Layer (zero dependencies), Application Layer (CQRS Commands, Queries, Behaviors), Infrastructure Layer (EF Core, SQL Server, External Services), and API Layer (ASP.NET Core Web API with Rate Limiting & Swagger).',
    keyMetrics:
      'Reduced average query latency by 72% • Achieved 99.99% uptime across production workloads • Decreased deployment pipeline regression incidents to 0.',
    lessonsLearned:
      'Adopting MediatR pipelines for cross-cutting concerns like validation and caching dramatically simplifies controller code. Explicit EF Core Fluent API mappings prevent subtle schema drift and optimize generated queries.',
    thumbnailUrl: '',
    liveUrl: 'https://demo.shahidhussain.dev',
    githubUrl: 'https://github.com/shahid08569/shahidPorfolioBackend',
    techStackJson: '[]',
    techStack: ['.NET 10', 'ASP.NET Core', 'Clean Architecture', 'MediatR CQRS', 'EF Core', 'SQL Server', 'Angular 22', 'TypeScript'],
    isCaseStudy: true,
    createdAtUtc: new Date().toISOString(),
  });

  ngOnInit(): void {
    if (this.slug) {
      this.loadProject(this.slug);
    }
  }

  private loadProject(slug: string): void {
    this.apiService.getProjectBySlug(slug).subscribe({
      next: (res) => {
        if (res.data) {
          this.project.set(res.data);
          this.seoService.updateMeta({
            title: `${res.data.title} | Case Study`,
            description: res.data.summary,
          });
        }
      },
      error: () => {},
    });
  }
}
