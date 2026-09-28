import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  readonly experiences = signal<ExperienceItem[]>([
    {
      id: '1',
      company: 'Enterprise Cloud Technologies',
      role: 'Senior Full-Stack .NET & Angular Engineer',
      location: 'Remote',
      employmentType: 'Full-Time',
      startDate: 'Jan 2023',
      endDate: 'Present',
      isCurrent: true,
      achievementsJson: '[]',
      achievements: [
        'Architected high-throughput microservices using .NET 10, ASP.NET Core Web API, and MediatR CQRS, reducing query latency by 45%.',
        'Led migration of enterprise UI to Angular 22 standalone components and signal-based reactivity, slashing initial bundle size by 35%.',
        'Implemented distributed caching using Redis and database query optimization with SQL Server, maintaining 99.99% system availability.',
        'Mentored 6 junior/mid-level engineers in Clean Architecture patterns, domain modeling, and unit testing best practices.',
      ],
      techStackJson: '[]',
      techStack: ['.NET 10', 'ASP.NET Core', 'Clean Architecture', 'MediatR', 'Angular 22', 'SQL Server', 'Redis', 'Docker'],
      displayOrder: 1,
    },
    {
      id: '2',
      company: 'FinTech Innovations Inc.',
      role: 'Full-Stack Software Engineer',
      location: 'Hybrid',
      employmentType: 'Full-Time',
      startDate: 'Aug 2020',
      endDate: 'Dec 2022',
      isCurrent: false,
      achievementsJson: '[]',
      achievements: [
        'Engineered secure payment processing and ledger reconciliation APIs compliant with PCI-DSS standards.',
        'Designed interactive financial telemetry dashboards using Angular, RxJS observables, and WebSocket live tickers.',
        'Authored comprehensive unit and integration test suites in xUnit, Moq, and FluentAssertions, achieving 88% code coverage.',
      ],
      techStackJson: '[]',
      techStack: ['.NET 6/7', 'C#', 'Angular', 'Entity Framework Core', 'PostgreSQL', 'xUnit'],
      displayOrder: 2,
    },
  ]);

  readonly educations = signal<EducationItem[]>([
    {
      id: '1',
      institution: 'University of Engineering and Technology',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2016',
      endDate: '2020',
      gradeOrHonors: 'Graduated with First Class Honors • Dean’s Honor Roll',
      displayOrder: 1,
    },
  ]);

  ngOnInit(): void {
    this.seoService.updateMeta({
      title: 'Work Experience & Education Timeline',
      description:
        'Professional work history, enterprise roles, quantified engineering achievements, and educational background of Shahid Hussain.',
    });

    this.loadTimeline();
  }

  private loadTimeline(): void {
    this.apiService.getTimeline().subscribe({
      next: (res) => {
        if (res.data) {
          if (res.data.experiences && res.data.experiences.length > 0) {
            this.experiences.set(res.data.experiences);
          }
          if (res.data.educations && res.data.educations.length > 0) {
            this.educations.set(res.data.educations);
          }
        }
      },
      error: () => {},
    });
  }
}
