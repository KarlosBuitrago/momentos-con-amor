import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ImageUploadService } from './image-upload.service';
import { ImageBase64Service } from './image-base64.service';

export interface SmartUploadResult {
  url: string;
  isBase64: boolean;
  size: number;
  method: 'storage' | 'base64' | 'fallback';
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SmartImageUploadService {
  // Límite de Storage en bytes (4.5 GB para dejar margen)
  private readonly STORAGE_LIMIT = 4.5 * 1024 * 1024 * 1024;

  // Tamaño estimado usado (se actualiza con cada subida)
  private estimatedStorageUsed = 0;

  constructor(
    private imageUploadService: ImageUploadService,
    private imageBase64Service: ImageBase64Service
  ) {
    // Cargar uso estimado del localStorage
    const saved = localStorage.getItem('storageUsed');
    if (saved) {
      this.estimatedStorageUsed = parseInt(saved, 10);
    }
  }

  /**
   * Sube una imagen de forma inteligente:
   * 1. Intenta Firebase Storage
   * 2. Si falla o está cerca del límite, usa Base64
   *
   * @param file Archivo de imagen
   * @param folder Carpeta en Storage
   * @returns Observable con resultado
   */
  uploadImage(file: File, folder: string = 'products'): Observable<SmartUploadResult> {
    // Verificar si estamos cerca del límite
    const nearLimit = this.isNearStorageLimit(file.size);

    if (nearLimit) {
      console.warn('⚠️ Cerca del límite de Storage, usando Base64 automáticamente');
      return this.uploadAsBase64(file, 'near-limit');
    }

    // Intentar subir a Storage primero
    return this.imageUploadService.uploadImage(file, folder).pipe(
      switchMap(response => {
        // Éxito en Storage
        this.updateStorageUsage(file.size);

        return of({
          url: response.url,
          isBase64: false,
          size: file.size,
          method: 'storage' as const,
          message: 'Imagen subida a Firebase Storage'
        });
      }),
      catchError(error => {
        // Error en Storage, usar Base64 como fallback
        console.warn('⚠️ Error en Storage, usando Base64 como fallback:', error);
        return this.uploadAsBase64(file, 'fallback');
      })
    );
  }

  /**
   * Sube múltiples imágenes de forma inteligente
   * @param files Array de archivos
   * @param folder Carpeta
   * @returns Observable con array de resultados
   */
  uploadMultipleImages(files: File[], folder: string = 'products'): Observable<SmartUploadResult[]> {
    const uploadPromises = files.map(file =>
      this.uploadImage(file, folder).toPromise()
    );
    return from(Promise.all(uploadPromises));
  }

  /**
   * Convierte y sube como Base64
   * @param file Archivo
   * @param reason Razón del uso de Base64
   * @returns Observable con resultado
   */
  private uploadAsBase64(file: File, reason: 'near-limit' | 'fallback'): Observable<SmartUploadResult> {
    return from(
      this.imageBase64Service.convertToBase64(file, 800, 800, 0.8)
    ).pipe(
      switchMap(base64 => {
        const size = this.imageBase64Service.getBase64Size(base64);

        return of({
          url: base64,
          isBase64: true,
          size: size,
          method: 'base64' as const,
          message: reason === 'near-limit'
            ? 'Imagen guardada como Base64 (Storage cerca del límite)'
            : 'Imagen guardada como Base64 (fallback)'
        });
      })
    );
  }

  /**
   * Verifica si estamos cerca del límite de Storage
   * @param fileSize Tamaño del archivo a subir
   * @returns true si está cerca del límite
   */
  private isNearStorageLimit(fileSize: number): boolean {
    const projectedUsage = this.estimatedStorageUsed + fileSize;
    const percentageUsed = (projectedUsage / this.STORAGE_LIMIT) * 100;

    // Si vamos a usar más del 90%, usar Base64
    return percentageUsed > 90;
  }

  /**
   * Actualiza el uso estimado de Storage
   * @param size Tamaño del archivo subido
   */
  private updateStorageUsage(size: number): void {
    this.estimatedStorageUsed += size;
    localStorage.setItem('storageUsed', this.estimatedStorageUsed.toString());
  }

  /**
   * Obtiene el uso actual de Storage
   * @returns Objeto con información de uso
   */
  getStorageUsage(): {
    used: number;
    limit: number;
    percentage: number;
    remaining: number;
    usedFormatted: string;
    remainingFormatted: string;
  } {
    const percentage = (this.estimatedStorageUsed / this.STORAGE_LIMIT) * 100;
    const remaining = this.STORAGE_LIMIT - this.estimatedStorageUsed;

    return {
      used: this.estimatedStorageUsed,
      limit: this.STORAGE_LIMIT,
      percentage: percentage,
      remaining: remaining,
      usedFormatted: this.formatBytes(this.estimatedStorageUsed),
      remainingFormatted: this.formatBytes(remaining)
    };
  }

  /**
   * Resetea el contador de uso (útil para testing o reset manual)
   */
  resetStorageUsage(): void {
    this.estimatedStorageUsed = 0;
    localStorage.removeItem('storageUsed');
  }

  /**
   * Detecta si una URL es Base64 o URL de Storage
   * @param url URL o Base64 string
   * @returns true si es Base64
   */
  isBase64(url: string): boolean {
    return url.startsWith('data:image/');
  }

  /**
   * Formatea bytes a formato legible
   * @param bytes Cantidad de bytes
   * @returns String formateado
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Valida un archivo de imagen
   * @param file Archivo a validar
   * @returns Resultado de validación
   */
  validateImageFile(file: File): { valid: boolean; error?: string } {
    // Usar la validación del servicio de upload
    return this.imageUploadService.validateImageFile(file);
  }

  /**
   * Genera vista previa de una imagen
   * @param file Archivo
   * @returns Promise con URL de vista previa
   */
  generatePreview(file: File): Promise<string> {
    return this.imageUploadService.generatePreview(file);
  }
}
