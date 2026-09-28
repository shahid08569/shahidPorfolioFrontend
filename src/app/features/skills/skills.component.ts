import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { SkillCategoryGroup, SkillCategory } from '../../core/models/skill.model';

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

  readonly skillGroups = signal<SkillCategoryGroup[]>([
    {
      category: SkillCategory.Backend,
      categoryName: 'Backend & Cloud Architecture',
      skills: [
        { id: '1', name: '.NET 10 / C#', proficiency: 95, isTopSkill: true, displayOrder: 1 },
        { id: '2', name: 'ASP.NET Core Web API', proficiency: 95, isTopSkill: true, displayOrder: 2 },
        { id: '3', name: 'Clean Architecture & DDD', proficiency: 90, isTopSkill: true, displayOrder: 3 },
        { id: '4', name: 'CQRS & MediatR', proficiency: 90, isTopSkill: true, displayOrder: 4 },
        { id: '5', name: 'Microservices & Event-Driven', proficiency: 85, isTopSkill: false, displayOrder: 5 },
        { id: '6', name: 'RESTful API & Swagger', proficiency: 95, isTopSkill: false, displayOrder: 6 },
        { id: '7', name: 'SignalR Real-Time Streaming', proficiency: 85, isTopSkill: false, displayOrder: 7 },
      ],
    },
    {
      category: SkillCategory.Frontend,
      categoryName: 'Frontend & Web Architecture',
      skills: [
        { id: '8', name: 'Angular 22 (Standalone)', proficiency: 95, isTopSkill: true, displayOrder: 1 },
        { id: '9', name: 'TypeScript', proficiency: 90, isTopSkill: true, displayOrder: 2 },
        { id: '10', name: 'Angular Signals & State', proficiency: 90, isTopSkill: true, displayOrder: 3 },
        { id: '11', name: 'Angular SSR & Hydration', proficiency: 85, isTopSkill: false, displayOrder: 4 },
        { id: '12', name: 'SCSS & Design Systems', proficiency: 90, isTopSkill: false, displayOrder: 5 },
        { id: '13', name: 'RxJS & Reactive Streams', proficiency: 85, isTopSkill: false, displayOrder: 6 },
      ],
    },
    {
      category: SkillCategory.Database,
      categoryName: 'Databases & Persistence',
      skills: [
        { id: '14', name: 'Microsoft SQL Server', proficiency: 90, isTopSkill: true, displayOrder: 1 },
        { id: '15', name: 'Entity Framework Core', proficiency: 95, isTopSkill: true, displayOrder: 2 },
        { id: '16', name: 'Database Indexing & Tuning', proficiency: 85, isTopSkill: false, displayOrder: 3 },
        { id: '17', name: 'PostgreSQL', proficiency: 80, isTopSkill: false, displayOrder: 4 },
        { id: '18', name: 'Redis Caching & Pub/Sub', proficiency: 85, isTopSkill: false, displayOrder: 5 },
      ],
    },
    {
      category: SkillCategory.DevOps,
      categoryName: 'DevOps, Testing & Tooling',
      skills: [
        { id: '19', name: 'Docker & Containerization', proficiency: 85, isTopSkill: true, displayOrder: 1 },
        { id: '20', name: 'xUnit & Moq Unit Testing', proficiency: 90, isTopSkill: true, displayOrder: 2 },
        { id: '21', name: 'FluentAssertions & Integration Tests', proficiency: 90, isTopSkill: false, displayOrder: 3 },
        { id: '22', name: 'CI/CD (GitHub Actions)', proficiency: 80, isTopSkill: false, displayOrder: 4 },
        { id: '23', name: 'Git & Branching Workflows', proficiency: 95, isTopSkill: false, displayOrder: 5 },
      ],
    },
  ]);

  ngOnInit(): void {
    this.seoService.updateMeta({
      title: 'Technical Skills & Architecture Matrix',
      description:
        'Detailed breakdown of technical competencies, design patterns, and engineering frameworks utilized by Shahid Hussain across .NET and Angular.',
    });

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
        if (res.data && res.data.length > 0) {
          this.skillGroups.set(res.data);
        }
      },
      error: () => {},
    });
  }
}
