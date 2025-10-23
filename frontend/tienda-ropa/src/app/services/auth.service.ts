import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {
    // Verificar si hay un token guardado al iniciar
    this.checkStoredToken();
  }

  private checkStoredToken(): void {
    const token = this.getToken();
    const user = this.getStoredUser();

    if (token && user) {
      // Restaurar usuario desde localStorage
      this.currentUserSubject.next(user);

      // Verificar si el token sigue siendo válido (opcional)
      this.verifyToken(token).subscribe({
        next: (response) => {
          // Token válido, actualizar usuario por si cambió algo
          this.setUser(response.user);
          this.currentUserSubject.next(response.user);
        },
        error: () => {
          // Token inválido, limpiar
          this.clearToken();
          this.clearUser();
          this.currentUserSubject.next(null);
        }
      });
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          // Guardar token y usuario
          this.setToken(response.token);
          this.setUser(response.user);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): void {
    this.clearToken();
    this.clearUser();
    this.currentUserSubject.next(null);
  }

  verifyToken(token: string): Observable<{ message: string; user: User }> {
    return this.http.post<{ message: string; user: User }>(`${this.apiUrl}/verify-token`, { token });
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.tokenKey, token);
  }

  private clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.tokenKey);
  }

  private setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  private getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('current_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  private clearUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('current_user');
  }
}
