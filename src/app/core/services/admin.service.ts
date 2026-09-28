import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

export interface AdminContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  receivedAtUtc: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  // Projects
  createProject(command: any): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/admin/projects`, command);
  }

  updateProject(id: string, command: any): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${this.baseUrl}/admin/projects/${id}`, command);
  }

  deleteProject(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/admin/projects/${id}`);
  }

  // Skills
  createSkill(command: any): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/admin/skills`, command);
  }

  updateSkill(id: string, command: any): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${this.baseUrl}/admin/skills/${id}`, command);
  }

  deleteSkill(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/admin/skills/${id}`);
  }

  // Experiences
  createExperience(command: any): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/admin/experiences`, command);
  }

  updateExperience(id: string, command: any): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${this.baseUrl}/admin/experiences/${id}`, command);
  }

  deleteExperience(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/admin/experiences/${id}`);
  }

  // Blog
  createBlogPost(command: any): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/admin/blog`, command);
  }

  updateBlogPost(id: string, command: any): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${this.baseUrl}/admin/blog/${id}`, command);
  }

  deleteBlogPost(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/admin/blog/${id}`);
  }

  // Messages
  getMessages(): Observable<ApiResponse<AdminContactMessage[]>> {
    return this.http.get<ApiResponse<AdminContactMessage[]>>(`${this.baseUrl}/admin/messages`);
  }

  markMessageAsRead(id: string): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${this.baseUrl}/admin/messages/${id}/read`, {});
  }

  deleteMessage(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/admin/messages/${id}`);
  }

  // Settings
  updateSettings(command: any): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${this.baseUrl}/admin/settings`, command);
  }

  // Media
  uploadFile(file: File): Observable<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/media/upload`, formData);
  }

  uploadCv(file: File): Observable<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/media/upload-cv`, formData);
  }
}
