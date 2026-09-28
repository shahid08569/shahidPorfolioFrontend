import { Component, OnInit, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { SeoService } from '../../../core/services/seo.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { BlogPostDetail } from '../../../core/models/blog.model';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss'],
})
export class BlogPostComponent implements OnInit {
  @Input() slug = '';

  private readonly apiService = inject(ApiService);
  private readonly seoService = inject(SeoService);

  readonly post = signal<BlogPostDetail>({
    id: '1',
    title: 'Architecting Clean Microservices in .NET 10 with MediatR & CQRS',
    slug: 'architecting-clean-microservices-dotnet-10',
    summary:
      'A practical guide to structuring enterprise .NET solutions with strict layer boundaries, FluentValidation pipelines, and zero-leakage domain models.',
    contentMarkdown: `
### 1. Introduction to Clean Architecture
In high-scale enterprise engineering, maintaining a clear separation of concerns is the difference between an adaptable codebase and technical bankruptcy. Clean Architecture (often combined with Domain-Driven Design) structures software such that the business domain sits at the core, independent of databases, web frameworks, or third-party integrations.

### 2. Why MediatR & CQRS?
Command Query Responsibility Segregation (CQRS) splits data mutations (Commands) from read operations (Queries):
- **Commands**: Encapsulate intent (e.g., \`CreateProjectCommand\`, \`SubmitContactMessageCommand\`). They enforce business validation via MediatR Pipeline Behaviors before hitting persistence.
- **Queries**: Are optimized strictly for read throughput using EF Core \`AsNoTracking()\` and project directly to lightweight DTOs.

### 3. Pipeline Behaviors for Cross-Cutting Concerns
Instead of bloating API controllers with repetitive validation or logging boilerplate, MediatR allows pipeline behaviors to intercept every incoming request:

\`\`\`csharp
public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators) => _validators = validators;

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var context = new ValidationContext<TRequest>(request);
        var failures = _validators
            .Select(v => v.Validate(context))
            .SelectMany(result => result.Errors)
            .Where(f => f != null)
            .ToList();

        if (failures.Count != 0)
            throw new ValidationException(failures);

        return await next();
    }
}
\`\`\`

### 4. Conclusion
By decoupling intent from execution, our backend becomes effortlessly testable. Handlers can be verified with isolated xUnit test cases without needing web server spin-up or complex integration setups.
    `,
    coverImageUrl: '',
    tagsJson: '[]',
    tags: ['.NET 10', 'Clean Architecture', 'CQRS', 'MediatR'],
    readTimeMinutes: 6,
    publishedAtUtc: new Date().toISOString(),
  });

  ngOnInit(): void {
    if (this.slug) {
      this.loadPost(this.slug);
    }
  }

  private loadPost(slug: string): void {
    this.apiService.getBlogPostBySlug(slug).subscribe({
      next: (res) => {
        if (res.data) {
          this.post.set(res.data);
          this.seoService.updateMeta({
            title: res.data.title,
            description: res.data.summary,
          });
        }
      },
      error: () => {},
    });
  }
}
