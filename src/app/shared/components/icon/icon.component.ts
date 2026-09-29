import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="icon-container"
      [style.width.px]="size"
      [style.height.px]="size"
      [innerHTML]="sanitizedSvg"
      aria-hidden="true"
    ></span>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        vertical-align: middle;
        line-height: 0;
      }
      .icon-container {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }
      :host ::ng-deep svg {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class IconComponent {
  private readonly sanitizer = inject(DomSanitizer);

  @Input() name = '';
  @Input() size = 20;

  get sanitizedSvg(): SafeHtml {
    const rawSvg = this.getRawSvg(this.name?.toLowerCase().trim() || '');
    return this.sanitizer.bypassSecurityTrustHtml(rawSvg);
  }

  private getRawSvg(key: string): string {
    const icons: Record<string, string> = {
      // Social & Branding
      github:
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>',
      linkedin:
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>',
      twitter:
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',

      // Contact & Communication
      email:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
      mail:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',

      // Navigation & Actions
      'external-link':
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>',
      'arrow-right':
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
      'chevron-right':
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>',
      download:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
      menu:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',
      close:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
      check:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
      'check-circle':
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',

      // System & Themes
      sun:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',
      moon:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
      calendar:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
      clock:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
      'map-pin':
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
      briefcase:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
      graduation:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>',
      sparkles:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"></path></svg>',
      quote:
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-8.983z"/></svg>',

      // Engineering & Architectures
      code:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
      terminal:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>',
      server:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>',
      database:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>',
      layers:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
      api:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M7 15V9l3 6V9"></path><path d="M14 9h2a2 2 0 0 1 0 4h-2"></path><path d="M14 9v6"></path><path d="M19 9v6"></path></svg>',

      // Specific Framework & Tech Logos
      angular:
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5L2.8 5.8l1.4 12.1L12 22.5l7.8-4.6 1.4-12.1L12 2.5zm0 2.7l6 2.1-1.1 9.4L12 19.4l-4.9-2.7-1.1-9.4 6-2.1zm0 3.3l-3.3 7.5h1.7l.7-1.7h3.8l.7 1.7h1.7L12 8.5zm0 2.5l1.2 2.9h-2.4l1.2-2.9z"/></svg>',
      typescript:
        '<svg viewBox="0 0 24 24" fill="currentColor"><rect width="24" height="24" rx="4" fill="currentColor" fill-opacity="0.15"/><path d="M11.5 8h-7v2.2h2.3v8.3h2.4v-8.3h2.3V8zm3.2 8.7c.8.5 1.8.8 2.8.8 1.1 0 1.9-.4 1.9-1.2 0-.8-.7-1.1-1.9-1.6-1.7-.6-2.7-1.5-2.7-2.9 0-1.8 1.4-3.1 3.7-3.1 1.2 0 2.2.3 2.9.7l-.6 1.9c-.6-.4-1.4-.7-2.3-.7-1.1 0-1.6.5-1.6 1.1 0 .7.6 1 1.8 1.5 1.8.7 2.8 1.5 2.8 3 0 1.9-1.4 3.2-4.1 3.2-1.3 0-2.6-.4-3.4-1l.7-1.7z"/></svg>',
      javascript:
        '<svg viewBox="0 0 24 24" fill="currentColor"><rect width="24" height="24" rx="4" fill="currentColor" fill-opacity="0.15"/><path d="M12.5 16.5c0 1.7-1 2.5-2.6 2.5-.9 0-1.7-.3-2.3-.7l.6-1.7c.4.3.9.5 1.5.5.7 0 1-.3 1-.9v-7.7h2.2v7.3zm3.7.2c.8.5 1.8.8 2.8.8 1.1 0 1.9-.4 1.9-1.2 0-.8-.7-1.1-1.9-1.6-1.7-.6-2.7-1.5-2.7-2.9 0-1.8 1.4-3.1 3.7-3.1 1.2 0 2.2.3 2.9.7l-.6 1.9c-.6-.4-1.4-.7-2.3-.7-1.1 0-1.6.5-1.6 1.1 0 .7.6 1 1.8 1.5 1.8.7 2.8 1.5 2.8 3 0 1.9-1.4 3.2-4.1 3.2-1.3 0-2.6-.4-3.4-1l.7-1.7z"/></svg>',
      rxjs:
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
      sass:
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12c0 4.1 2.5 7.7 6.1 9.2.1-.8.2-1.8.4-2.5-.6-.3-1.1-.7-1.5-1.3-.9-1.3-.3-2.9 1.1-3.6 1.2-.6 2.6-.4 3.7.3.7.4 1.2 1.1 1.4 1.9.4-.1.8-.3 1.2-.5.5-.3.9-.7 1.1-1.3.4-1.1-.3-2.3-1.4-2.5-1.7-.3-3.4.7-4 2.3-.1.3-.2.5-.4.5-.3 0-.5-.3-.4-.6.8-2.2 3.1-3.4 5.3-2.9 1.8.4 2.9 2.1 2.4 3.9-.3.9-.9 1.7-1.8 2.1-.5.3-1.1.4-1.7.5.3 1.2-.3 2.5-1.5 2.9-.6.2-1.2.1-1.8-.1-.2 1-.4 2.1-.6 3.1C10.7 23.9 11.3 24 12 24c6.6 0 12-5.4 12-12S18.5 2 12 2z"/></svg>',
      dotnet:
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L3 7.2v9.6L12 22l9-5.2V7.2L12 2zm-4.5 12.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm9 0h-2v-4.5h-1.5V8.5h5V10h-1.5v4.5zm-5-3.5c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5v2h-1.5V8.5H10v1.2c.4-.8 1.2-1.2 2-1.2 1.4 0 2.5 1.1 2.5 2.5v3.5h-2v-3.5z"/></svg>',
      csharp:
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L3 7.2v9.6L12 22l9-5.2V7.2L12 2zm1 14.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5c1.4 0 2.6.6 3.4 1.6l-1.5 1.3c-.5-.6-1.2-1-1.9-1-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5c.7 0 1.4-.4 1.9-1l1.5 1.3c-.8 1-2 1.6-3.4 1.6zm5.5-3.5h-1v1h-1v-1h-1v-1h1v-1h1v1h1v1z"/></svg>',
      'sql-server':
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path><path d="M8 12h8"></path><path d="M8 16h8"></path></svg>',
      postgresql:
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-9.8 12.2c.7 3.2 2.9 5.8 5.8 7.1v-2.3c-1.8-1-3.1-2.9-3.6-5.1.9.4 1.9.6 3 .5v-2c-.9.1-1.7-.1-2.4-.4.4-2.1 1.7-3.8 3.5-4.7v2.2c-.8.5-1.4 1.3-1.7 2.2.8.2 1.6.3 2.5.2v-2c-.6.1-1.2 0-1.7-.2.6-1.7 2.1-3 3.9-3.4v2.1c-.6.3-1.1.8-1.4 1.4.7.1 1.4.1 2.1 0v-2c-.5 0-.9-.1-1.4-.3.9-1.3 2.5-2.2 4.2-2.3v2c-.4.2-.8.5-1.1.9.7 0 1.3 0 2-.1v-2c-.4 0-.8-.1-1.2-.2 1.3-.9 2.9-1.3 4.5-1.1v2c-.3.1-.6.3-.9.6.6 0 1.2 0 1.8-.1v-2c-.3 0-.6 0-.9-.1 2.3.5 4.1 2.2 4.8 4.4-.8.1-1.6.3-2.3.6v-2c.4-.2.7-.4 1-.7-.8-1.5-2.3-2.5-4-2.8v2.1c.4.2.8.4 1.1.7-.8.1-1.5.3-2.2.6v-2c.4-.2.8-.3 1.2-.4-1.2-.9-2.7-1.4-4.2-1.5V2z"/></svg>',
      redis:
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 6.5 12 11l10-4.5L12 2zm0 8.5L4 7v3.5l8 4.5 8-4.5V7l-8 3.5zm0 6L4 12v3.5l8 4.5 8-4.5V12l-8 4.5z"/></svg>',
      git:
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.7 10.7l-8.4-8.4c-.9-.9-2.5-.9-3.4 0l-1.4 1.4 3.6 3.6c.9-.3 1.9-.1 2.6.6.7.7.9 1.7.6 2.6l3.5 3.5c.9-.3 1.9-.1 2.6.6.9.9.9 2.5 0 3.4-.9.9-2.5.9-3.4 0-.7-.7-.9-1.7-.6-2.6l-3.5-3.5v5.3c.3.2.6.5.7.9.5 1.1 0 2.4-1.1 2.9-1.1.5-2.4 0-2.9-1.1-.4-.9-.1-1.9.5-2.5v-5.6l-3.7-3.7-5.4 5.4c-.9.9-.9 2.5 0 3.4l8.4 8.4c.9.9 2.5.9 3.4 0l8.4-8.4c1-.9 1-2.5 0-3.4z"/></svg>',
      docker:
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.9 10.3h2.1v2.1h-2.1v-2.1zm-3.2 0h2.1v2.1h-2.1v-2.1zm-3.2 0h2.1v2.1H7.5v-2.1zm6.4-3.2h2.1v2.1h-2.1V7.1zm-3.2 0h2.1v2.1h-2.1V7.1zm-3.2 0h2.1v2.1H7.5V7.1zm6.4-3.2h2.1V6h-2.1V3.9zm8.5 7.4c-.5-.4-1.6-.6-2.6-.2-.2-.7-.6-1.3-1.2-1.7l-.6-.4-.4.6c-.4.7-.6 1.4-.4 2.1-.5.3-1.3.3-2 .3H1.2c-.4 1.7-.1 3.5.7 5 1.3 2.5 3.8 4.2 6.6 4.4 5.3.4 10.2-2.3 12.5-7.1 1.1-.1 2.1-.7 2.6-1.6l.3-.6-.6-.8z"/></svg>',
      workflow:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="6" height="6" rx="1"></rect><rect x="15" y="3" width="6" height="6" rx="1"></rect><rect x="9" y="15" width="6" height="6" rx="1"></rect><path d="M6 9v3a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9"></path><path d="M12 12v3"></path></svg>',
      trash:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',
      edit:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
      plus:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
      eye:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      whatsapp:
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.2.301-.777.978-.953 1.18-.176.2-.352.225-.653.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.787-1.677-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.352.452-.527.151-.176.201-.301.301-.502.1-.2.05-.376-.025-.527-.075-.15-.678-1.633-.929-2.235-.245-.586-.494-.506-.678-.515-.176-.008-.376-.01-.577-.01-.201 0-.527.075-.803.376s-1.054 1.03-1.054 2.511 1.079 2.912 1.23 3.113c.151.2 2.124 3.243 5.146 4.549.719.311 1.281.497 1.719.636.722.23 1.378.197 1.898.12.58-.087 1.78-.727 2.031-1.43.251-.703.251-1.305.176-1.43-.075-.125-.276-.2-.577-.35zm-5.429 7.618h-.005a9.938 9.938 0 0 1-5.06-1.393l-.363-.215-3.761.986 1.003-3.666-.236-.375a9.923 9.923 0 0 1-1.52-5.334c0-5.498 4.474-9.972 9.976-9.972 2.664 0 5.168 1.038 7.051 2.921a9.914 9.914 0 0 1 2.919 7.051c0 5.499-4.474 9.973-9.976 9.973z"/></svg>',
      certificate:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>',
    };

    return (
      icons[key] ||
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>'
    );
  }
}
