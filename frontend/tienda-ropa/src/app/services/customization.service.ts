import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Customization {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: 'accessory' | 'packaging' | 'embroidery' | 'other';
  applicableTo: ('doll' | 'kit' | 'material' | 'course')[];
  imageUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: any;
  updatedAt?: any;
}

@Injectable({
  providedIn: 'root'
})
export class CustomizationService {
  private apiUrl = `${environment.apiUrl}/customizations`;

  constructor(private http: HttpClient) {}

  getAll(filters?: { category?: string; applicableTo?: string; isActive?: boolean }): Observable<Customization[]> {
    let params = new HttpParams();
    if (filters?.category) params = params.set('category', filters.category);
    if (filters?.applicableTo) params = params.set('applicableTo', filters.applicableTo);
    if (filters?.isActive !== undefined) params = params.set('isActive', filters.isActive.toString());

    return this.http.get<Customization[]>(this.apiUrl, { params });
  }

  search(query: string): Observable<Customization[]> {
    return this.http.get<Customization[]>(`${this.apiUrl}/search`, {
      params: { q: query }
    });
  }

  getById(id: string): Observable<Customization> {
    return this.http.get<Customization>(`${this.apiUrl}/${id}`);
  }

  getByIds(ids: string[]): Observable<Customization[]> {
    return this.http.post<Customization[]>(`${this.apiUrl}/batch`, { ids });
  }

  create(customization: Customization): Observable<Customization> {
    return this.http.post<Customization>(this.apiUrl, customization);
  }

  update(id: string, customization: Partial<Customization>): Observable<Customization> {
    return this.http.put<Customization>(`${this.apiUrl}/${id}`, customization);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
