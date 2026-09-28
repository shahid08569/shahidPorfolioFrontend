import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

  private readonly defaultTitle = 'Shahid Hussain | Full-Stack .NET & Angular Developer';
  private readonly defaultDescription =
    'Senior Full-Stack Developer specializing in high-performance .NET 10 Clean Architecture backends and modern Angular single-page applications.';

  updateTitle(title: string): void {
    const fullTitle = title ? `${title} | Shahid Hussain` : this.defaultTitle;
    this.titleService.setTitle(fullTitle);
    this.metaService.updateTag({ property: 'og:title', content: fullTitle });
    this.metaService.updateTag({ name: 'twitter:title', content: fullTitle });
  }

  updateMeta(config: SeoConfig): void {
    this.updateTitle(config.title);

    const description = config.description || this.defaultDescription;
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ name: 'twitter:description', content: description });

    if (config.keywords) {
      this.metaService.updateTag({ name: 'keywords', content: config.keywords });
    }

    if (config.ogImage) {
      this.metaService.updateTag({ property: 'og:image', content: config.ogImage });
      this.metaService.updateTag({ name: 'twitter:image', content: config.ogImage });
    }

    if (config.ogUrl) {
      this.metaService.updateTag({ property: 'og:url', content: config.ogUrl });
    }

    this.metaService.updateTag({ property: 'og:type', content: config.ogType || 'website' });
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
  }

  resetToDefault(): void {
    this.titleService.setTitle(this.defaultTitle);
    this.metaService.updateTag({ name: 'description', content: this.defaultDescription });
    this.metaService.updateTag({ property: 'og:title', content: this.defaultTitle });
    this.metaService.updateTag({ property: 'og:description', content: this.defaultDescription });
  }
}
