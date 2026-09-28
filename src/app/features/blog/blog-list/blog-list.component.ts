import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { SeoService } from '../../../core/services/seo.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { BlogPostCard } from '../../../core/models/blog.model';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly seoService = inject(SeoService);

  readonly posts = signal<BlogPostCard[]>([
    {
      id: '1',
      title: 'Architecting Clean Microservices in .NET 10 with MediatR & CQRS',
      slug: 'architecting-clean-microservices-dotnet-10',
      summary:
        'A practical guide to structuring enterprise .NET solutions with strict layer boundaries, FluentValidation pipelines, and zero-leakage domain models.',
      coverImageUrl: '',
      tagsJson: '[]',
      tags: ['.NET 10', 'Clean Architecture', 'CQRS', 'MediatR'],
      readTimeMinutes: 6,
      publishedAtUtc: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Mastering Angular 22 Signals & Modern SSR Hydration',
      slug: 'mastering-angular-22-signals-ssr',
      summary:
        'Why Angular signals eliminate unnecessary change detection cycles and how event replay + hydration transform Core Web Vitals in 2026.',
      coverImageUrl: '',
      tagsJson: '[]',
      tags: ['Angular 22', 'Signals', 'SSR', 'Web Performance'],
      readTimeMinutes: 5,
      publishedAtUtc: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ]);

  ngOnInit(): void {
    this.seoService.updateMeta({
      title: 'Engineering Articles & Architecture Insights',
      description:
        'In-depth technical guides on .NET Clean Architecture, CQRS, MediatR, and modern Angular standalone performance by Shahid Hussain.',
    });

    this.loadPosts();
  }

  private loadPosts(): void {
    this.apiService.getBlogPosts().subscribe({
      next: (res) => {
        if (res.data && res.data.length > 0) {
          this.posts.set(res.data);
        }
      },
      error: () => {},
    });
  }
}
