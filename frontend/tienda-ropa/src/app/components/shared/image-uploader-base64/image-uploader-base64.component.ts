import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageBase64Service } from '../../../services/image-base64.service';

@Component({
  selector: 'app-image-uploader-base64',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="image-uploader">
      <div class="upload-area" [class.has-image]="imageBase64">
        <!-- Vista previa de la imagen -->
        <div class="image-preview" *ngIf="imageBase64">
          <img [src]="imageBase64" [alt]="label">
          <button type="button" class="btn-remove" (click)="removeImage()" *ngIf="!processing">
            ×
          </button>
          <div class="image-info" *ngIf="imageSize">
            <span class="size-badge">{{ imageSize }}</span>
          </div>
        </div>

        <!-- Área de carga -->
        <div class="upload-prompt" *ngIf="!imageBase64">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <p>{{ label }}</p>
          <p class="hint">JPG, PNG, GIF o WEBP (máx. 2MB)</p>
          <p class="hint">Se comprimirá automáticamente</p>
        </div>

        <!-- Input de archivo oculto -->
        <input
          type="file"
          #fileInput
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          (change)="onFileSelected($event)"
          [disabled]="processing"
          class="file-input">

        <!-- Botón de selección -->
        <button
          type="button"
          class="btn-select"
          (click)="fileInput.click()"
          [disabled]="processing"
          *ngIf="!imageBase64">
          Seleccionar imagen
        </button>

        <!-- Indicador de procesamiento -->
        <div class="processing-overlay" *ngIf="processing">
          <div class="spinner"></div>
          <p>{{ processingMessage }}</p>
        </div>

        <!-- Mensaje de error -->
        <div class="error-message" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <!-- Advertencia de tamaño -->
        <div class="warning-message" *ngIf="sizeWarning">
          ⚠️ {{ sizeWarning }}
        </div>
      </div>

      <!-- Configuración de compresión -->
      <div class="compression-settings" *ngIf="showSettings && !imageBase64">
        <label>
          <input type="checkbox" [(ngModel)]="autoCompress" [disabled]="processing">
          Comprimir automáticamente (recomendado)
        </label>
      </div>
    </div>
  `,
  styles: [`
    .image-uploader {
      width: 100%;
    }

    .upload-area {
      position: relative;
      border: 2px dashed #ddd;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      transition: all 0.3s;
      min-height: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #fafafa;
    }

    .upload-area:hover {
      border-color: #007bff;
      background: #fff;
    }

    .upload-area.has-image {
      border-style: solid;
      border-color: #28a745;
      background: #f0fff4;
    }

    .image-preview {
      position: relative;
      width: 100%;
      max-width: 300px;
    }

    .image-preview img {
      width: 100%;
      height: auto;
      max-height: 300px;
      object-fit: contain;
      border-radius: 8px;
    }

    .image-info {
      margin-top: 10px;
      display: flex;
      justify-content: center;
      gap: 10px;
    }

    .size-badge {
      padding: 4px 8px;
      background: #007bff;
      color: white;
      border-radius: 4px;
      font-size: 0.85rem;
    }

    .btn-remove {
      position: absolute;
      top: -10px;
      right: -10px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #dc3545;
      color: white;
      border: none;
      font-size: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      transition: all 0.2s;
    }

    .btn-remove:hover {
      background: #c82333;
      transform: scale(1.1);
    }

    .upload-prompt {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      color: #666;
    }

    .upload-prompt svg {
      color: #999;
    }

    .upload-prompt p {
      margin: 0;
      font-size: 1rem;
    }

    .upload-prompt .hint {
      font-size: 0.85rem;
      color: #999;
    }

    .file-input {
      display: none;
    }

    .btn-select {
      margin-top: 15px;
      padding: 10px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-select:hover:not(:disabled) {
      background: #0056b3;
    }

    .btn-select:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .processing-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.95);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      gap: 15px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-message {
      margin-top: 10px;
      padding: 10px;
      background: #fee;
      color: #c00;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .warning-message {
      margin-top: 10px;
      padding: 10px;
      background: #fff3cd;
      color: #856404;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .compression-settings {
      margin-top: 10px;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 4px;
    }

    .compression-settings label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 0.9rem;
    }
  `]
})
export class ImageUploaderBase64Component {
  @Input() label = 'Arrastra una imagen o haz click para seleccionar';
  @Input() imageBase64: string | null = null;
  @Input() maxWidth = 800;
  @Input() maxHeight = 800;
  @Input() quality = 0.8;
  @Input() showSettings = false;
  @Output() imageConverted = new EventEmitter<string>();
  @Output() imageRemoved = new EventEmitter<void>();

  processing = false;
  processingMessage = '';
  errorMessage: string | null = null;
  sizeWarning: string | null = null;
  imageSize: string | null = null;
  autoCompress = true;

  constructor(private imageBase64Service: ImageBase64Service) {}

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Validar archivo
    const validation = this.imageBase64Service.validateImageFile(file);
    if (!validation.valid) {
      this.errorMessage = validation.error || 'Archivo inválido';
      return;
    }

    this.errorMessage = null;
    this.sizeWarning = null;

    try {
      this.processing = true;
      this.processingMessage = 'Procesando imagen...';

      // Convertir a Base64 con compresión
      const base64 = await this.imageBase64Service.convertToBase64(
        file,
        this.maxWidth,
        this.maxHeight,
        this.quality
      );

      // Verificar tamaño
      const sizeInBytes = this.imageBase64Service.getBase64Size(base64);
      this.imageSize = this.imageBase64Service.formatSize(sizeInBytes);
      const sizeInKB = sizeInBytes / 1024;

      // Advertir si es muy grande
      if (sizeInKB > 300) {
        this.sizeWarning = `Imagen grande (${this.imageSize}). Considera usar una imagen más pequeña para mejor rendimiento.`;
      }

      // Advertir si se acerca al límite de Firestore
      if (sizeInKB > 800) {
        this.errorMessage = `Imagen demasiado grande (${this.imageSize}). Firestore tiene un límite de 1MB por documento. Por favor, usa una imagen más pequeña.`;
        this.processing = false;
        return;
      }

      this.imageBase64 = base64;
      this.processing = false;
      this.imageConverted.emit(base64);

    } catch (error) {
      this.processing = false;
      this.errorMessage = 'Error al procesar la imagen';
      console.error('Error:', error);
    }

    // Limpiar input
    input.value = '';
  }

  removeImage(): void {
    this.imageBase64 = null;
    this.errorMessage = null;
    this.sizeWarning = null;
    this.imageSize = null;
    this.imageRemoved.emit();
  }
}
