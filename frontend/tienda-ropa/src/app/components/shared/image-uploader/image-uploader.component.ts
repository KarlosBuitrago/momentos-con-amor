import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadService } from '../../../services/image-upload.service';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="image-uploader">
      <div class="upload-area" [class.has-image]="previewUrl || imageUrl">
        <!-- Vista previa de la imagen -->
        <div class="image-preview" *ngIf="previewUrl || imageUrl">
          <img [src]="previewUrl || imageUrl" [alt]="label">
          <button type="button" class="btn-remove" (click)="removeImage()" *ngIf="!uploading">
            ×
          </button>
        </div>

        <!-- Área de carga -->
        <div class="upload-prompt" *ngIf="!previewUrl && !imageUrl">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <p>{{ label }}</p>
          <p class="hint">JPG, PNG, GIF o WEBP (máx. 5MB)</p>
        </div>

        <!-- Input de archivo oculto -->
        <input
          type="file"
          #fileInput
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          (change)="onFileSelected($event)"
          [disabled]="uploading"
          class="file-input">

        <!-- Botón de selección -->
        <button
          type="button"
          class="btn-select"
          (click)="fileInput.click()"
          [disabled]="uploading"
          *ngIf="!previewUrl && !imageUrl">
          Seleccionar imagen
        </button>

        <!-- Indicador de carga -->
        <div class="uploading-overlay" *ngIf="uploading">
          <div class="spinner"></div>
          <p>Subiendo imagen...</p>
        </div>

        <!-- Mensaje de error -->
        <div class="error-message" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
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
      border-color: #ff6b6b;
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
      background: #ff6b6b;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-select:hover:not(:disabled) {
      background: #ff5252;
    }

    .btn-select:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .uploading-overlay {
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
      border-top: 4px solid #ff6b6b;
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
  `]
})
export class ImageUploaderComponent {
  @Input() label = 'Arrastra una imagen o haz click para seleccionar';
  @Input() imageUrl: string | null = null;
  @Input() folder = 'products';
  @Output() imageUploaded = new EventEmitter<string>();
  @Output() imageRemoved = new EventEmitter<void>();

  previewUrl: string | null = null;
  uploading = false;
  errorMessage: string | null = null;

  constructor(private imageUploadService: ImageUploadService) {}

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Validar archivo
    const validation = this.imageUploadService.validateImageFile(file);
    if (!validation.valid) {
      this.errorMessage = validation.error || 'Archivo inválido';
      return;
    }

    this.errorMessage = null;

    try {
      // Generar vista previa
      this.previewUrl = await this.imageUploadService.generatePreview(file);

      // Subir imagen
      this.uploading = true;
      this.imageUploadService.uploadImage(file, this.folder).subscribe({
        next: (response) => {
          this.uploading = false;
          this.imageUrl = response.url;
          this.imageUploaded.emit(response.url);
        },
        error: (error) => {
          this.uploading = false;
          this.errorMessage = error.error?.error || 'Error al subir la imagen';
          this.previewUrl = null;
          console.error('Error subiendo imagen:', error);
        }
      });
    } catch (error) {
      this.errorMessage = 'Error al procesar la imagen';
      console.error('Error:', error);
    }

    // Limpiar input
    input.value = '';
  }

  removeImage(): void {
    this.previewUrl = null;
    this.imageUrl = null;
    this.errorMessage = null;
    this.imageRemoved.emit();
  }
}
