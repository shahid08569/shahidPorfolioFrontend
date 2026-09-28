import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  // Public Shell Routes
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/projects/projects.component').then((m) => m.ProjectsComponent),
      },
      {
        path: 'projects/:slug',
        loadComponent: () =>
          import('./features/projects/project-detail/project-detail.component').then(
            (m) => m.ProjectDetailComponent
          ),
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./features/skills/skills.component').then((m) => m.SkillsComponent),
      },
      {
        path: 'experience',
        loadComponent: () =>
          import('./features/experience/experience.component').then(
            (m) => m.ExperienceComponent
          ),
      },
      {
        path: 'blog',
        loadComponent: () =>
          import('./features/blog/blog-list/blog-list.component').then(
            (m) => m.BlogListComponent
          ),
      },
      {
        path: 'blog/:slug',
        loadComponent: () =>
          import('./features/blog/blog-post/blog-post.component').then(
            (m) => m.BlogPostComponent
          ),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/contact/contact.component').then((m) => m.ContactComponent),
      },
    ],
  },

  // Admin CMS Routes
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./features/admin/login/login.component').then((m) => m.AdminLoginComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/dashboard/dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
  },

  // Fallback
  {
    path: '**',
    redirectTo: '',
  },
];
