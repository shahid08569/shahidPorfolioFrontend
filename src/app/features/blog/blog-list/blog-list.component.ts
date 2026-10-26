import { Component, OnInit, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
  private readonly platformId = inject(PLATFORM_ID);

  readonly posts = signal<BlogPostCard[]>([]);
  readonly isLoading = signal(true);

  ngOnInit(): void {
    this.seoService.updateMeta({
      title: 'Engineering Articles & Architecture Insights',
      description:
        'In-depth technical guides on .NET Clean Architecture, CQRS, MediatR, and modern Angular standalone performance by Shahid Hussain.',
    });

    if (isPlatformBrowser(this.platformId)) {
      try {
        const cached = sessionStorage.getItem('shahid_cached_blog_posts');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.posts.set(parsed);
            this.isLoading.set(false);
          }
        }
      } catch {}
    }

    this.loadPosts();
  }

  private loadPosts(): void {
    this.apiService.getBlogPosts().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.data) {
          this.posts.set(res.data);
          if (isPlatformBrowser(this.platformId)) {
            try { sessionStorage.setItem('shahid_cached_blog_posts', JSON.stringify(res.data)); } catch {}
          }
        }
      },
      error: () => this.isLoading.set(false),
    });
  }
}
