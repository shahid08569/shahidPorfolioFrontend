import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'shahid_portfolio_theme';

  readonly currentTheme = signal<Theme>('light');

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.setTheme('light');
  }

  toggleTheme(): void {
    this.setTheme('light');
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set('light');

    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem(this.storageKey, 'light');
    }
  }
}
