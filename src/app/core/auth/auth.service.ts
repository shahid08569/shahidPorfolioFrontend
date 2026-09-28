import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

export interface AuthUser {
  email: string;
  username: string;
}

export interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
  expiresAtUtc: string;
  email: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly baseUrl = environment.apiUrl;

  private readonly tokenKey = 'shahid_portfolio_token';
  private readonly refreshKey = 'shahid_portfolio_refresh';
  private readonly userKey = 'shahid_portfolio_user';

  readonly currentUser = signal<AuthUser | null>(null);
  readonly isAuthenticated = signal<boolean>(false);

  constructor() {
    this.initAuth();
  }

  private initAuth(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem(this.tokenKey);
    const userJson = localStorage.getItem(this.userKey);

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as AuthUser;
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch {
        this.logout();
      }
    }
  }

  login(credentials: { email: string; password: string }): Observable<ApiResponse<AuthResponseData>> {
    return this.http.post<ApiResponse<AuthResponseData>>(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.handleAuthSuccess(res.data);
        }
      })
    );
  }

  refreshToken(): Observable<ApiResponse<AuthResponseData> | null> {
    if (!isPlatformBrowser(this.platformId)) return of(null);

    const refreshToken = localStorage.getItem(this.refreshKey);
    if (!refreshToken) {
      this.logout();
      return of(null);
    }

    return this.http
      .post<ApiResponse<AuthResponseData>>(`${this.baseUrl}/auth/refresh`, { refreshToken })
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            this.handleAuthSuccess(res.data);
          } else {
            this.logout();
          }
        }),
        catchError(() => {
          this.logout();
          return of(null);
        })
      );
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.refreshKey);
      localStorage.removeItem(this.userKey);
    }

    this.router.navigate(['/admin/login']);
  }

  getAccessToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(this.tokenKey);
  }

  private handleAuthSuccess(data: AuthResponseData): void {
    const user: AuthUser = { email: data.email, username: data.username };
    this.currentUser.set(user);
    this.isAuthenticated.set(true);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, data.accessToken);
      localStorage.setItem(this.refreshKey, data.refreshToken);
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }
}
