import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Tag {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  category: 'ocasión' | 'público' | 'característica' | 'uso' | 'estilo' | 'other';
  color?: string;
  isActive?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private apiUrl = `${environment.apiUrl}/tags`;

  constructor(private http: HttpClient) {}

  getAll(filters?: { category?: string; isActive?: boolean }): Observable<Tag[]> {
    let params = new HttpParams();
    if (filters?.category) params = params.set('category', filters.category);
    if (filters?.isActive !== undefined) params = params.set('isActive', filters.isActive.toString());

    return this.http.get<Tag[]>(this.apiUrl, { params });
  }

  search(query: string): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiUrl}/search`, {
      params: { q: query }
    });
  }

  getById(id: string): Observable<Tag> {
    return this.http.get<Tag>(`${this.apiUrl}/${id}`);
  }

  getByIds(ids: string[]): Observable<Tag[]> {
    return this.http.post<Tag[]>(`${this.apiUrl}/batch`, { ids });
  }

  create(tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(this.apiUrl, tag);
  }

  update(id: string, tag: Partial<Tag>): Observable<Tag> {
    return this.http.put<Tag>(`${this.apiUrl}/${id}`, tag);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
