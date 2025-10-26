import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageBase64Service {

  /**
   * Convierte un archivo de imagen a Base64
   * @param file Archivo de imagen
   * @param maxWidth Ancho máximo (para comprimir)
   * @param maxHeight Alto máximo (para comprimir)
   * @param quality Calidad de compresión (0-1)
   * @returns Promise con string Base64
   */
  convertToBase64(
    file: File,
    maxWidth: number = 800,
    maxHeight: number = 800,
    quality: number = 0.8
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          // Crear canvas para redimensionar
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calcular nuevas dimensiones manteniendo proporción
          if (width > height) {
            if (width > maxWidth) {
              height = height * (maxWidth / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = width * (maxHeight / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Dibujar imagen redimensionada
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Convertir a Base64 con compresión
          const base64 = canvas.toDataURL('image/jpeg', quality);

          // Verificar tamaño (Firestore tiene límite de 1MB por documento)
          const sizeInBytes = this.getBase64Size(base64);
          const sizeInKB = sizeInBytes / 1024;

          if (sizeInKB > 300) {
            console.warn(`Imagen grande: ${sizeInKB.toFixed(2)}KB. Considera reducir calidad o tamaño.`);
          }

          resolve(base64);
        };

        img.onerror = reject;
        img.src = e.target.result;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Convierte múltiples archivos a Base64
   * @param files Array de archivos
   * @param maxWidth Ancho máximo
   * @param maxHeight Alto máximo
   * @param quality Calidad
   * @returns Promise con array de strings Base64
   */
  async convertMultipleToBase64(
    files: File[],
    maxWidth: number = 800,
    maxHeight: number = 800,
    quality: number = 0.8
  ): Promise<string[]> {
    const promises = files.map(file =>
      this.convertToBase64(file, maxWidth, maxHeight, quality)
    );
    return Promise.all(promises);
  }

  /**
   * Valida que el archivo sea una imagen válida
   * @param file Archivo a validar
   * @returns Objeto con validación
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

    // Validar tamaño (máximo 2MB para Base64)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'El archivo es demasiado grande. Tamaño máximo: 2MB'
      };
    }

    return { valid: true };
  }

  /**
   * Calcula el tamaño de un string Base64 en bytes
   * @param base64 String Base64
   * @returns Tamaño en bytes
   */
  getBase64Size(base64: string): number {
    // Remover el prefijo data:image/...;base64,
    const base64String = base64.split(',')[1] || base64;

    // Calcular tamaño
    const padding = (base64String.match(/=/g) || []).length;
    return (base64String.length * 3) / 4 - padding;
  }

  /**
   * Formatea el tamaño en bytes a formato legible
   * @param bytes Tamaño en bytes
   * @returns String formateado (ej: "250 KB")
   */
  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  /**
   * Genera una vista previa de la imagen
   * @param file Archivo de imagen
   * @returns Promise con URL de vista previa
   */
  generatePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Comprime una imagen Base64 existente
   * @param base64 String Base64
   * @param quality Nueva calidad (0-1)
   * @returns Promise con Base64 comprimido
   */
  compressBase64(base64: string, quality: number = 0.7): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);

        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.onerror = reject;
      img.src = base64;
    });
  }
}
