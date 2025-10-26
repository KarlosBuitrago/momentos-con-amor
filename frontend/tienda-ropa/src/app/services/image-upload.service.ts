import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private apiUrl = `${environment.apiUrl}/upload`;

  constructor(private http: HttpClient) {}

  /**
   * Sube una imagen al servidor (Firebase Storage)
   * @param file Archivo de imagen
   * @param folder Carpeta donde guardar (products, materials, courses)
   * @returns Observable con la URL de la imagen subida
   */
  uploadImage(file: File, folder: string = 'products'): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    return this.http.post<{ url: string }>(`${this.apiUrl}/image`, formData);
  }

  /**
   * Sube múltiples imágenes
   * @param files Array de archivos
   * @param folder Carpeta donde guardar
   * @returns Observable con array de URLs
   */
  uploadMultipleImages(files: File[], folder: string = 'products'): Observable<{ urls: string[] }> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('images', file);
    });
    formData.append('folder', folder);

    return this.http.post<{ urls: string[] }>(`${this.apiUrl}/images`, formData);
  }

  /**
   * Elimina una imagen del servidor
   * @param imageUrl URL de la imagen a eliminar
   * @returns Observable con resultado
   */
  deleteImage(imageUrl: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/image`, {
      body: { imageUrl }
    });
  }

  /**
   * Valida que el archivo sea una imagen válida
   * @param file Archivo a validar
   * @returns true si es válido, false si no
   */
  validateImageFile(file: File): { valid: boolean; error?: string } {
    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Tipo de archivo no válido. Solo se permiten: JPG, PNG, GIF, WEBP'
      };
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'El archivo es demasiado grande. Tamaño máximo: 5MB'
      };
    }

    return { valid: true };
  }

  /**
   * Genera una vista previa de la imagen
   * @param file Archivo de imagen
   * @returns Promise con la URL de vista previa
   */
  generatePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
