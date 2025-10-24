import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  targetAudience: string;
  imageUrl: string;
  stock: number;
  materials?: string[];
  difficulty?: string;
  isCourse?: boolean;
  slug?: string;
  isAvailable?: boolean;
  imageGallery?: string[];
  customizations?: ProductCustomization[];
  tags?: string[];
  allowPersonalization?: boolean;
  productionTimeDays?: number;
  productType?: 'doll' | 'material' | 'course';
  dollGender?: string;
  isKit?: boolean;
  includedMaterials?: string[];
}

export interface ProductCustomization {
  id: string;
  label: string;
  price?: number;
  defaultSelected?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  private storageKey = 'local_products_v1';

  constructor(private http: HttpClient) { }

  private readLocal(): Product[] {
    try {
      if (typeof window === 'undefined') return [];
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return [];
      return JSON.parse(raw) as Product[];
    } catch (e) {
      console.warn('Error reading local products', e);
      return [];
    }
  }

  /** Devuelve la URL base del backend para mostrarla en la UI de administración. */
  getBackendEndpoint(): string {
    return this.apiUrl;
  }

  /** Limpiar productos del localStorage (útil para eliminar productos fantasma) */
  clearLocalStorage(): void {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(this.storageKey);
      console.log('LocalStorage de productos limpiado');
    } catch (e) {
      console.warn('Error limpiando localStorage', e);
    }
  }

  private writeLocal(products: Product[]): void {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(this.storageKey, JSON.stringify(products));
    } catch (e) {
      console.warn('Error writing local products', e);
    }
  }

  private seedIfEmpty(): Product[] {
    const existing = this.readLocal();
    if (existing && existing.length > 0) return existing;

    const sample: Product[] = [
      {
        id: 'p-' + Date.now().toString(),
        name: 'Muñeco ejemplo - Conejito',
        description: 'Muñeco de ejemplo tejido a mano, suave y apto para todas las edades. Medidas aproximadas 20cm.',
        price: 35000,
        category: 'Muñecos',
        targetAudience: 'Unisex',
        imageUrl: 'assets/images/default-doll.svg',
        stock: 5,
        materials: ['Hilo acrílico', 'Relleno hipoalergénico'],
        difficulty: 'Intermedio',
        isCourse: false,
        isAvailable: true,
        allowPersonalization: true,
        productionTimeDays: 5,
        productType: 'doll',
        dollGender: 'Unisex',
        isKit: false,
        includedMaterials: [],
        tags: ['conejo', 'regalo', 'personalizado'],
        customizations: [
          { id: 'gift-box', label: 'Caja para regalo', price: 5000 },
          { id: 'embroidery-name', label: 'Nombre bordado', price: 7000 },
          { id: 'extra-accessory', label: 'Accesorio extra (pañuelo)', price: 3000 }
        ]
      },
      {
        id: 'p-' + (Date.now() + 1).toString(),
        name: 'Muñeco ejemplo - Osito',
        description: 'Pequeño osito tejido con materiales suaves. Ideal como decoración o regalo.',
        price: 30000,
        category: 'Muñecos',
        targetAudience: 'Niños',
        imageUrl: 'assets/images/default-doll.svg',
        stock: 3,
        materials: ['Hilo algodón', 'Ojos de seguridad'],
        difficulty: 'Principiante',
        isCourse: false,
        isAvailable: true,
        allowPersonalization: true,
        productionTimeDays: 7,
        productType: 'doll',
        dollGender: 'Niños',
        isKit: false,
        includedMaterials: [],
        tags: ['oso', 'detalle', 'infantil'],
        customizations: [
          { id: 'keychain-ring', label: 'Agregar llavero', price: 2000 },
          { id: 'scented', label: 'Fragancia suave', price: 2500 }
        ]
      }
    ];

    this.writeLocal(sample);
    return sample;
  }

  // Obtener todos los productos con filtros opcionales
  getProducts(filters?: any): Observable<Product[]> {
    // Build params if filters provided
    let params: HttpParams | undefined;
    if (filters) {
      params = new HttpParams();
      if (filters.category) params = params.set('category', filters.category);
      if (filters.targetAudience) params = params.set('targetAudience', filters.targetAudience);
      if (filters.minPrice != null) params = params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice != null) params = params.set('maxPrice', filters.maxPrice.toString());
    }

    return this.http.get<Product[]>(this.apiUrl, { params }).pipe(
      catchError(err => {
        console.error('Error al obtener productos del backend:', err);
        // Retornar array vacío en lugar de usar localStorage
        return of([]);
      })
    );
  }

  // Obtener un producto por ID
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError((err) => {
        console.error('Error al obtener producto del backend:', err);
        return throwError(() => new Error('Producto no encontrado'));
      })
    );
  }

  // Crear un nuevo producto
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      catchError((err) => {
        console.error('Error al crear producto en el backend:', err);
        return throwError(() => new Error('Error al crear el producto'));
      })
    );
  }

  /**
   * Crear producto garantizando uso exclusivo del backend.
   * Si la llamada falla se re-emite el error para que la UI avise al usuario.
   */
  createProductRemote(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  // Actualizar un producto existente
  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product).pipe(
      catchError((err) => {
        console.error('Error al actualizar producto en el backend:', err);
        return throwError(() => new Error('Error al actualizar el producto'));
      })
    );
  }

  // Eliminar un producto
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      map(() => ({ success: true })),
      catchError((err) => {
        console.error('Error al eliminar producto del backend:', err);
        return throwError(() => new Error('Error al eliminar el producto'));
      })
    );
  }
}
