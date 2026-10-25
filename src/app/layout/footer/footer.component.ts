import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ApiService } from '../../core/services/api.service';
import { PublicSettings } from '../../core/models/settings.model';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly currentYear = new Date().getFullYear();
  readonly settings = signal<PublicSettings | null>(null);

  // Static nav groups — can be made DB-driven later
  readonly quickLinks = [
    { label: 'Home',       path: '/'          },
    { label: 'Projects',   path: '/projects'  },
    { label: 'Skills',     path: '/skills'    },
    { label: 'Experience', path: '/experience'},
  ];

  readonly moreLinks = [
    { label: 'Blog',       path: '/blog'    },
    { label: 'Contact',    path: '/contact' },
  ];

  // Fallback socials if none from DB
  readonly defaultSocials = [
    { platform: 'GitHub',   url: 'https://github.com/shahid08569',           iconKey: 'github'   },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/shahidhussain',   iconKey: 'linkedin' },
    { platform: 'Email',    url: 'mailto:shahidhussaain08569@gmail.com',     iconKey: 'email'    },
  ];

  get socialLinks() {
    return this.settings()?.socialLinks?.length
      ? this.settings()!.socialLinks
      : this.defaultSocials;
  }

  get fullName() { return this.settings()?.fullName || 'Shahid Hussain'; }
  get tagline()  { return this.settings()?.oneLineBio || 'Full-Stack .NET & Angular Developer'; }
  get availability() { return this.settings()?.availabilityStatus || 'Open to Work'; }

  ngOnInit(): void {
    this.api.getPublicSettings().subscribe({
      next: (res) => { if (res.data) this.settings.set(res.data); },
    });
  }
}
