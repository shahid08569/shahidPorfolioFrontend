import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  template: `
    <div class="layout-wrapper">
      <app-header></app-header>
      <main class="main-content" id="top">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: [
    `
      .layout-wrapper {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }
      .main-content {
        flex: 1;
        width: 100%;
      }
    `,
  ],
})
export class MainLayoutComponent {}
