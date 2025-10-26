import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartImageUploadService, SmartUploadResult } from '../../../services/smart-image-upload.service';

@Component({
  selector: 'app-smart-image-uploader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="smart-image-uploader">
      <!-- Indicador de uso de Storage -->
      <div class="storage-indicator" *ngIf="showStorageInfo">
        <div class="storage-bar">
          <div class="storage-used" [style.width.%]="storageUsage.percentage"></div>
        </div>
        <div class="storage-info">
          <span>Storage: {{ storageUsage.usedFormatted }} / {{ storageUsage.remainingFormatted }} disponible</span>
          <span class="storage-percentage" [class.warning]="storageUsage.percentage > 80">
            {{ storageUsage.percentage.toFixed(1) }}%
          </span>
        </div>
      </div>

      <div class="upload-area" [class.has-image]="imageUrl">
        <!-- Vista previa de la imagen -->
        <div class="image-preview" *ngIf="imageUrl">
          <img [src]="imageUrl" [alt]="label">
          <button type="button" class="btn-remove" (click)="removeImage()" *ngIf="!uploading">
            ×
          </button>

          <!-- Badge indicando el tipo de almacenamiento -->
          <div class="storage-badge" *ngIf="uploadResult">
            <span *ngIf="!uploadResult.isBase64" class="badge-storage">☁️ Storage</span>
            <span *ngIf="uploadResult.isBase64" class="badge-base64">💾 Base64</span>
          </div>
        </div>

        <!-- Área de carga -->
        <div class="upload-prompt" *ngIf="!imageUrl">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <p>{{ label }}</p>
          <p class="hint">JPG, PNG, GIF o WEBP (máx. 5MB)</p>
          <p class="hint smart-hint">🤖 Se guardará automáticamente en el mejor formato</p>
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
          *ngIf="!imageUrl">
          Seleccionar imagen
        </button>

        <!-- Indicador de carga -->
        <div class="uploading-overlay" *ngIf="uploading">
          <div class="spinner"></div>
          <p>{{ uploadingMessage }}</p>
        </div>

        <!-- Mensaje de éxito -->
        <div class="success-message" *ngIf="successMessage">
          ✓ {{ successMessage }}
        </div>

        <!-- Mensaje de error -->
        <div class="error-message" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .smart-image-uploader {
      width: 100%;
    }

    .storage-indicator {
      margin-bottom: 15px;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 6px;
    }

    .storage-bar {
      height: 8px;
      background: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 8px;
    }

    .storage-used {
      height: 100%;
      background: linear-gradient(90deg, #28a745, #ffc107);
      transition: width 0.3s ease;
    }

    .storage-info {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      color: #666;
    }

    .storage-percentage {
      font-weight: 600;
      color: #28a745;
    }

    .storage-percentage.warning {
      color: #ffc107;
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

    .storage-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      display: flex;
      gap: 5px;
    }

    .badge-storage,
    .badge-base64 {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      color: white;
    }

    .badge-storage {
      background: #007bff;
    }

    .badge-base64 {
      background: #6c757d;
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

    .upload-prompt .smart-hint {
      color: #007bff;
      font-weight: 500;
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
      border-top: 4px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .success-message {
      margin-top: 10px;
      padding: 10px;
      background: #d4edda;
      color: #155724;
      border-radius: 4px;
      font-size: 0.9rem;
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
export class SmartImageUploaderComponent implements OnInit {
  @Input() label = 'Arrastra una imagen o haz click para seleccionar';
  @Input() imageUrl: string | null = null;
  @Input() folder = 'products';
  @Input() showStorageInfo = true;
  @Output() imageUploaded = new EventEmitter<SmartUploadResult>();
  @Output() imageRemoved = new EventEmitter<void>();

  uploading = false;
  uploadingMessage = '';
  successMessage: string | null = null;
  errorMessage: string | null = null;
  uploadResult: SmartUploadResult | null = null;
  storageUsage: any = {};

  constructor(private smartImageUploadService: SmartImageUploadService) {}

  ngOnInit(): void {
    this.updateStorageUsage();
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Validar archivo
    const validation = this.smartImageUploadService.validateImageFile(file);
    if (!validation.valid) {
      this.errorMessage = validation.error || 'Archivo inválido';
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;

    try {
      this.uploading = true;
      this.uploadingMessage = 'Subiendo imagen...';

      // Subir con el servicio inteligente
      this.smartImageUploadService.uploadImage(file, this.folder).subscribe({
        next: (result) => {
          this.uploading = false;
          this.uploadResult = result;
          this.imageUrl = result.url;
          this.successMessage = result.message || 'Imagen subida correctamente';

          // Actualizar uso de storage
          this.updateStorageUsage();

          // Emitir evento
          this.imageUploaded.emit(result);

          // Limpiar mensaje de éxito después de 3 segundos
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (error) => {
          this.uploading = false;
          this.errorMessage = error.error?.error || 'Error al subir la imagen';
          console.error('Error subiendo imagen:', error);
        }
      });
    } catch (error) {
      this.uploading = false;
      this.errorMessage = 'Error al procesar la imagen';
      console.error('Error:', error);
    }

    // Limpiar input
    input.value = '';
  }

  removeImage(): void {
    this.imageUrl = null;
    this.uploadResult = null;
    this.errorMessage = null;
    this.successMessage = null;
    this.imageRemoved.emit();
  }

  updateStorageUsage(): void {
    this.storageUsage = this.smartImageUploadService.getStorageUsage();
  }
}
