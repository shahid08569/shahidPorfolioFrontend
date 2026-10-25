import { Component, OnInit, OnDestroy, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  template: `
    <div class="layout-wrapper">
      <!-- Global Top Scroll Progress Bar -->
      <div
        class="scroll-progress-bar"
        [style.width.%]="scrollProgress()"
        role="progressbar"
        aria-label="Page reading progress"
      ></div>

      <app-header></app-header>

      <main class="main-content" id="top">
        <router-outlet></router-outlet>
      </main>

      <app-footer></app-footer>

      <!-- Global Floating Back to Top Button with Smooth Bounce -->
      <button
        type="button"
        class="floating-back-to-top"
        [class.visible]="showBackToTop()"
        (click)="scrollToTop()"
        aria-label="Back to top"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="btt-icon">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
    </div>
  `,
  styles: [
    `
      .layout-wrapper {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        position: relative;
      }

      .scroll-progress-bar {
        position: fixed;
        top: 0;
        left: 0;
        height: 3.5px;
        background: linear-gradient(90deg, #d4a373, #c08d5c, #a3b178);
        z-index: 9999;
        transition: width 100ms ease-out;
        box-shadow: 0 0 10px rgba(212, 163, 115, 0.7);
        border-radius: 0 4px 4px 0;
      }

      .main-content {
        flex: 1;
        width: 100%;
      }

      .floating-back-to-top {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: var(--light-bronze, #d4a373);
        color: var(--text-heading, #3b2f23);
        border: 2px solid var(--cornsilk, #fefae0);
        box-shadow: 0 6px 20px rgba(59, 47, 35, 0.22);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 850;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px) scale(0.9);
        transition: opacity 300ms ease, transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), visibility 300ms;

        &.visible {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }

        &:hover {
          background: var(--bronze-dark, #c08d5c);
          transform: translateY(-4px) scale(1.08);
          box-shadow: 0 10px 24px rgba(59, 47, 35, 0.3);
        }

        .btt-icon {
          width: 20px;
          height: 20px;
        }
      }
    `,
  ],
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  readonly scrollProgress = signal<number>(0);
  readonly showBackToTop = signal<boolean>(false);

  private scrollHandler?: () => void;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.scrollHandler = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        this.scrollProgress.set(Math.min(100, Math.max(0, progress)));
        this.showBackToTop.set(scrollTop > 400);
      };

      window.addEventListener('scroll', this.scrollHandler, { passive: true });
      this.scrollHandler();
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
