import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ProjectCard } from '../../core/models/project.model';
import { PublicSettings } from '../../core/models/settings.model';
import { Testimonial } from '../../core/models/testimonial.model';
import { SkillCategoryGroup } from '../../core/models/skill.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly seoService = inject(SeoService);

  // Signals for state
  readonly settings = signal<PublicSettings>({
    fullName: 'Shahid Hussain',
    professionalTitle: 'Senior Full-Stack .NET & Angular Developer',
    oneLineBio: 'Architecting resilient enterprise microservices, clean CQRS backends, and responsive modern web apps.',
    aboutSummary:
      'Senior software engineer with deep expertise in .NET 10, ASP.NET Core Web API, Clean Architecture, MediatR CQRS, EF Core, and Angular 22. Passionate about domain-driven design, high-throughput microservices, sub-second page performance, and clean code that scales.',
    availabilityStatus: 'Open to Work',
    currentLocation: 'Pakistan',
    cvUrl: '/uploads/Shahid_Hussain_CV.pdf',
    socialLinks: [
      { platform: 'GitHub', url: 'https://github.com/shahid08569', iconKey: 'github' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/shahidhussain', iconKey: 'linkedin' },
    ],
  });

  readonly featuredProjects = signal<ProjectCard[]>([
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
  ]);

  readonly topSkills = signal<{ name: string; category: string; icon: string }[]>([
    { name: '.NET 10 / C#', category: 'Backend', icon: 'server' },
    { name: 'ASP.NET Core Web API', category: 'Backend', icon: 'server' },
    { name: 'Clean Architecture & CQRS', category: 'Architecture', icon: 'code' },
    { name: 'Angular 22 & TypeScript', category: 'Frontend', icon: 'code' },
    { name: 'SQL Server & EF Core', category: 'Database', icon: 'database' },
    { name: 'Docker & Microservices', category: 'DevOps', icon: 'terminal' },
  ]);

  readonly testimonials = signal<Testimonial[]>([
    {
      id: '1',
      clientName: 'Alexander Wright',
      role: 'Head of Engineering',
      company: 'Apex Cloud Solutions',
      content:
        'Shahid is an outstanding full-stack engineer. He delivered our enterprise microservices platform ahead of schedule with zero architectural regressions and impeccable code quality.',
      linkedInUrl: 'https://linkedin.com',
    },
    {
      id: '2',
      clientName: 'Elena Rostova',
      role: 'Principal Product Manager',
      company: 'OmniTrade FinTech',
      content:
        'Working with Shahid was seamless. His mastery of both .NET backend architecture and Angular state management allowed us to launch a sub-second trading dashboard that our clients love.',
      linkedInUrl: 'https://linkedin.com',
    },
  ]);

  readonly keyMetrics = [
    { value: '5+', label: 'Years Experience' },
    { value: '25+', label: 'Enterprise Systems' },
    { value: '99.9%', label: 'Architecture Uptime' },
    { value: '< 80ms', label: 'Median API Latency' },
  ];

  ngOnInit(): void {
    this.seoService.updateMeta({
      title: 'Senior Full-Stack .NET & Angular Developer',
      description:
        'Portfolio of Shahid Hussain - Senior Full-Stack .NET & Angular Developer specializing in Clean Architecture, CQRS, and enterprise web solutions.',
    });

    this.loadData();
  }

  private loadData(): void {
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
  }
}
