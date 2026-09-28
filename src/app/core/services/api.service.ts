import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { PublicSettings } from '../models/settings.model';
import { ProjectCard, ProjectDetail } from '../models/project.model';
import { SkillCategoryGroup } from '../models/skill.model';
import { Timeline } from '../models/timeline.model';
import { Testimonial } from '../models/testimonial.model';
import { BlogPostCard, BlogPostDetail } from '../models/blog.model';
import { ContactMessageRequest } from '../models/contact.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getPublicSettings(): Observable<ApiResponse<PublicSettings>> {
    return this.http.get<ApiResponse<PublicSettings>>(`${this.baseUrl}/settings/public`);
  }

  getProjects(filters?: { isFeatured?: boolean; tag?: string }): Observable<ApiResponse<ProjectCard[]>> {
    let params = new HttpParams();
    if (filters?.isFeatured !== undefined) {
      params = params.set('isFeatured', filters.isFeatured.toString());
    }
    if (filters?.tag) {
      params = params.set('tag', filters.tag);
    }

    return this.http.get<ApiResponse<ProjectCard[]>>(`${this.baseUrl}/projects`, { params }).pipe(
      map((response) => {
        if (response.data) {
          response.data = response.data.map((p) => ({
            ...p,
            techStack: this.safeParseJson<string[]>(p.techStackJson, []),
          }));
        }
        return response;
      })
    );
  }

  getProjectBySlug(slug: string): Observable<ApiResponse<ProjectDetail>> {
    return this.http.get<ApiResponse<ProjectDetail>>(`${this.baseUrl}/projects/${slug}`).pipe(
      map((response) => {
        if (response.data) {
          response.data = {
            ...response.data,
            techStack: this.safeParseJson<string[]>(response.data.techStackJson, []),
          };
        }
        return response;
      })
    );
  }

  getSkills(): Observable<ApiResponse<SkillCategoryGroup[]>> {
    return this.http.get<ApiResponse<SkillCategoryGroup[]>>(`${this.baseUrl}/skills`);
  }

  getTimeline(): Observable<ApiResponse<Timeline>> {
    return this.http.get<ApiResponse<Timeline>>(`${this.baseUrl}/experiences/timeline`).pipe(
      map((response) => {
        if (response.data) {
          response.data.experiences = response.data.experiences.map((exp) => ({
            ...exp,
            achievements: this.safeParseJson<string[]>(exp.achievementsJson, []),
            techStack: this.safeParseJson<string[]>(exp.techStackJson, []),
          }));
        }
        return response;
      })
    );
  }

  getTestimonials(): Observable<ApiResponse<Testimonial[]>> {
    return this.http.get<ApiResponse<Testimonial[]>>(`${this.baseUrl}/testimonials`);
  }

  getBlogPosts(): Observable<ApiResponse<BlogPostCard[]>> {
    return this.http.get<ApiResponse<BlogPostCard[]>>(`${this.baseUrl}/blog`).pipe(
      map((response) => {
        if (response.data) {
          response.data = response.data.map((post) => ({
            ...post,
            tags: this.safeParseJson<string[]>(post.tagsJson, []),
          }));
        }
        return response;
      })
    );
  }

  getBlogPostBySlug(slug: string): Observable<ApiResponse<BlogPostDetail>> {
    return this.http.get<ApiResponse<BlogPostDetail>>(`${this.baseUrl}/blog/${slug}`).pipe(
      map((response) => {
        if (response.data) {
          response.data = {
            ...response.data,
            tags: this.safeParseJson<string[]>(response.data.tagsJson, []),
          };
        }
        return response;
      })
    );
  }

  submitContact(payload: ContactMessageRequest): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/contact`, payload);
  }

  private safeParseJson<T>(jsonStr: string | null | undefined, defaultValue: T): T {
    if (!jsonStr) return defaultValue;
    try {
      return JSON.parse(jsonStr) as T;
    } catch {
      return defaultValue;
    }
  }
}
