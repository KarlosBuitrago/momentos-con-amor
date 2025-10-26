import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Material {
  id?: string;
  name: string;
  description: string;
  type: 'thread' | 'filling' | 'accessory' | 'needle' | 'fabric' | 'other';
  brand?: string;
  color?: string;
  size?: string;
  composition?: string;
  imageUrl?: string;
  isActive?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private apiUrl = `${environment.apiUrl}/materials`;

  constructor(private http: HttpClient) {}

  getAll(filters?: { type?: string; brand?: string; isActive?: boolean }): Observable<Material[]> {
    let params = new HttpParams();
    if (filters?.type) params = params.set('type', filters.type);
    if (filters?.brand) params = params.set('brand', filters.brand);
    if (filters?.isActive !== undefined) params = params.set('isActive', filters.isActive.toString());

    return this.http.get<Material[]>(this.apiUrl, { params });
  }

  search(query: string): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.apiUrl}/search`, {
      params: { q: query }
    });
  }

  getById(id: string): Observable<Material> {
    return this.http.get<Material>(`${this.apiUrl}/${id}`);
  }

  getByIds(ids: string[]): Observable<Material[]> {
    return this.http.post<Material[]>(`${this.apiUrl}/batch`, { ids });
  }

  create(material: Material): Observable<Material> {
    return this.http.post<Material>(this.apiUrl, material);
  }

  update(id: string, material: Partial<Material>): Observable<Material> {
    return this.http.put<Material>(`${this.apiUrl}/${id}`, material);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
