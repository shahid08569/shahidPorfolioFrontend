import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { FeedbackModalComponent } from '../../shared/components/feedback-modal/feedback-modal.component';
import { ProjectCard } from '../../core/models/project.model';
import { PublicSettings } from '../../core/models/settings.model';
import { Testimonial } from '../../core/models/testimonial.model';
import { Certificate } from '../../core/models/certificate.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent, FeedbackModalComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly seoService = inject(SeoService);

  readonly isFeedbackModalOpen = signal(false);

  // Settings signal
  readonly settings = signal<PublicSettings>({
    fullName: 'Shahid Hussain',
    professionalTitle: 'Senior Full-Stack .NET & Angular Developer',
    oneLineBio: 'Architecting resilient enterprise microservices, clean CQRS backends, and responsive modern web apps.',
    aboutSummary:
      'Senior software engineer with deep expertise in .NET 10, ASP.NET Core Web API, Clean Architecture, MediatR CQRS, EF Core, and Angular 22. Passionate about domain-driven design, high-throughput microservices, sub-second page performance, and clean code that scales.',
    availabilityStatus: 'Open to Work',
    currentLocation: 'Pakistan',
    cvUrl: '/uploads/Shahid_Hussain_CV.pdf',
    whatsAppNumber: '923000000000',
    heroCodeTitle: 'ShahidPortfolio.sln - Clean Architecture',
    heroCodeSnippet: `public class SolutionArchitect
{
    public string Name => "Shahid Hussain";
    public string[] CoreStack => new[]
    {
        ".NET 10 / C#",
        "ASP.NET Core Web API",
        "Clean Architecture & CQRS",
        "Angular 22 (SSR)",
        "SQL Server & EF Core"
    };
    public bool DeliverCleanCode() => true;
}`,
    heroBadgesJson: '["Clean Architecture", "CQRS / MediatR", "Angular 22 Signals"]',
    socialLinks: [
      { platform: 'GitHub', url: 'https://github.com/shahid08569', iconKey: 'github' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/shahidhussain', iconKey: 'linkedin' },
    ],
  });

  readonly featuredProjects = signal<ProjectCard[]>([
    {
      id: '1',
      title: 'Enterprise E-Commerce API & Management Portal',
      slug: 'enterprise-ecommerce-portal',
      summary:
        'Scalable multi-tenant e-commerce system built with .NET Clean Architecture, EF Core, SQL Server, and an Angular admin dashboard.',
      problemStatement:
        'Traditional monolith e-commerce backends suffer from high database contention and coupled business logic during peak promotional flash sales.',
      solutionStatement:
        'Engineered a decoupled Clean Architecture backend using CQRS and MediatR to isolate read and write workloads, integrated with Redis cache and optimistic concurrency in EF Core.',
      architectureOverview:
        'Layered Clean Architecture: Domain Core -> Application CQRS Commands/Queries -> Infrastructure SQL Server Persistence -> Web API with JWT Auth and Rate Limiting.',
      keyMetrics:
        'Maintained sub-90ms response times under 5,000 concurrent product catalog queries; achieved 99.9% uptime during load testing.',
      thumbnailUrl: '',
      liveUrl: 'https://github.com/shahid08569/shahidPorfolioBackend',
      githubUrl: 'https://github.com/shahid08569/shahidPorfolioBackend',
      techStackJson: '[]',
      techStack: ['.NET 10', 'ASP.NET Core', 'Angular 22', 'SQL Server', 'MediatR', 'Redis'],
      isFeatured: true,
      isCaseStudy: true,
      displayOrder: 1,
    },
  ]);

  readonly topSkills = signal<{ name: string; category: string; icon: string }[]>([
    { name: '.NET 10 / C#', category: 'Backend', icon: 'server' },
    { name: 'ASP.NET Core Web API', category: 'Backend', icon: 'server' },
    { name: 'Clean Architecture & CQRS', category: 'Architecture', icon: 'code' },
    { name: 'Angular 22 & TypeScript', category: 'Frontend', icon: 'code' },
    { name: 'SQL Server & EF Core', category: 'Database', icon: 'database' },
    { name: 'Docker & Microservices', category: 'DevOps', icon: 'terminal' },
  ]);

  readonly testimonials = signal<Testimonial[]>([]);
  readonly certificates = signal<Certificate[]>([]);

  readonly keyMetrics = [
    { value: '5+', label: 'Years Experience' },
    { value: '25+', label: 'Enterprise Systems' },
    { value: '99.9%', label: 'Architecture Uptime' },
    { value: '< 80ms', label: 'Median API Latency' },
  ];

  get heroBadges(): string[] {
    try {
      if (this.settings().heroBadgesJson) {
        const parsed = JSON.parse(this.settings().heroBadgesJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return ['Clean Architecture', 'CQRS / MediatR', 'Angular 22 Signals'];
  }

  get whatsAppUrl(): string {
    const raw = this.settings().whatsAppNumber || '923000000000';
    const num = raw.replace(/[^0-9]/g, '');
    const text = encodeURIComponent('Hello Shahid, I reviewed your developer portfolio and would like to connect about an opportunity.');
    return `https://wa.me/${num}?text=${text}`;
  }

  ngOnInit(): void {
    this.seoService.updateMeta({
      title: 'Senior Full-Stack .NET & Angular Developer',
      description:
        'Portfolio of Shahid Hussain - Senior Full-Stack .NET & Angular Developer specializing in Clean Architecture, CQRS, and enterprise web solutions.',
    });

    this.loadData();
  }

  loadData(): void {
    this.apiService.getPublicSettings().subscribe({
      next: (res) => {
        if (res.data) {
          this.settings.set(res.data);
        }
      },
      error: () => {},
    });

    this.apiService.getProjects({ isFeatured: true }).subscribe({
      next: (res) => {
        if (res.data && res.data.length > 0) {
          this.featuredProjects.set(res.data);
        }
      },
      error: () => {},
    });

    this.apiService.getTestimonials().subscribe({
      next: (res) => {
        if (res.data && res.data.length > 0) {
          this.testimonials.set(res.data);
        }
      },
      error: () => {},
    });

    this.apiService.getCertificates().subscribe({
      next: (res) => {
        if (res.data && res.data.length > 0) {
          this.certificates.set(res.data as Certificate[]);
        }
      },
      error: () => {},
    });
  }

  openFeedbackModal(): void {
    this.isFeedbackModalOpen.set(true);
  }

  closeFeedbackModal(): void {
    this.isFeedbackModalOpen.set(false);
  }
}
