import {
  Component, inject, signal, HostListener, OnInit, PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { ApiService }   from '../../core/services/api.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

export interface NavItem {
  label: string;
  path:  string;
  icon?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './header.component.html',
  styleUrls:  ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  readonly themeService  = inject(ThemeService);
  private readonly api   = inject(ApiService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly isMobileMenuOpen = signal(false);
  readonly isScrolled        = signal(false);
  readonly availability      = signal<string>('Open to Work');
  readonly fullName          = signal<string>('Shahid Hussain');

  // Nav items — can be made dynamic from DB later via navLinks settings
  readonly navItems: NavItem[] = [
    { label: 'Home',       path: '/',           icon: 'home'        },
    { label: 'Projects',   path: '/projects',   icon: 'code'        },
    { label: 'Skills',     path: '/skills',     icon: 'server'      },
    { label: 'Experience', path: '/experience', icon: 'briefcase'   },
    { label: 'Blog',       path: '/blog',       icon: 'edit'        },
    { label: 'Contact',    path: '/contact',    icon: 'email'       },
  ];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const cached = sessionStorage.getItem('shahid_cached_settings');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.availabilityStatus) this.availability.set(parsed.availabilityStatus);
          if (parsed.fullName) this.fullName.set(parsed.fullName);
        }
      } catch {}
    }

    this.api.getPublicSettings().subscribe({
      next: (res) => {
        if (res.data) {
          this.availability.set(res.data.availabilityStatus || 'Open to Work');
          this.fullName.set(res.data.fullName || 'Shahid Hussain');
        }
      },
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled.set(window.scrollY > 20);
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = this.isMobileMenuOpen() ? 'hidden' : '';
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  get initials(): string {
    const parts = this.fullName().split(' ');
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0].substring(0, 2).toUpperCase();
  }
}
