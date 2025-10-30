import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ImageUploadState {
  selectedFile: File | null;
  previewUrl: string | null;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  fileName: string | null;
  fileSize: number | null;
}

@Component({
  selector: 'app-image-upload-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload-button.component.html',
  styleUrls: ['./image-upload-button.component.scss']
})
export class ImageUploadButtonComponent {
  @Input() currentImageUrl?: string;
  @Input() label: string = 'Cargar desde equipo';
  @Input() maxSizeMB: number = 5;
  @Input() required: boolean = false;

  @Output() imageSelected = new EventEmitter<File>();
  @Output() imageCleared = new EventEmitter<void>();
  @Output() uploadComplete = new EventEmitter<string>();
  @Output() uploadError = new EventEmitter<string>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor() {
    console.log('ImageUploadButtonComponent initialized');
  }

  state: ImageUploadState = {
    selectedFile: null,
    previewUrl: null,
    isUploading: false,
    uploadProgress: 0,
    error: null,
    fileName: null,
    fileSize: null
  };

  readonly acceptedFormats = 'image/png,image/jpeg,image/jpg,image/gif,image/webp';
  readonly acceptedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

  get hasSelection(): boolean {
    return this.state.selectedFile !== null;
  }

  get displayPreview(): string | null {
    return this.state.previewUrl || this.currentImageUrl || null;
  }

  get fileSizeFormatted(): string {
    if (!this.state.fileSize) return '';
    return this.formatBytes(this.state.fileSize);
  }

  get showWarning(): boolean {
    if (!this.state.fileSize) return false;
    const sizeMB = this.state.fileSize / (1024 * 1024);
    return sizeMB > this.maxSizeMB;
  }

  onButtonClick(): void {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Validar archivo
    const validation = this.validateFile(file);
    if (!validation.valid) {
      this.state.error = validation.error || 'Archivo no válido';
      this.uploadError.emit(this.state.error);
      return;
    }

    // Limpiar error previo
    this.state.error = null;

    // Guardar información del archivo
    this.state.selectedFile = file;
    this.state.fileName = file.name;
    this.state.fileSize = file.size;

    // Generar vista previa
    this.generatePreview(file);

    // Emitir evento
    this.imageSelected.emit(file);
  }

  clearSelection(): void {
    this.state = {
      selectedFile: null,
      previewUrl: null,
      isUploading: false,
      uploadProgress: 0,
      error: null,
      fileName: null,
      fileSize: null
    };

    // Limpiar input
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }

    this.imageCleared.emit();
  }

  private validateFile(file: File): { valid: boolean; error?: string } {
    // Validar tipo de archivo
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValidExtension = this.acceptedExtensions.includes(extension);
    const isValidMimeType = file.type.startsWith('image/');

    if (!isValidExtension || !isValidMimeType) {
      return {
        valid: false,
        error: 'Formato de archivo no válido. Use PNG, JPG, JPEG, GIF o WebP'
      };
    }

    // Validar tamaño (advertencia, no error)
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > this.maxSizeMB) {
      console.warn(`Archivo grande (${sizeMB.toFixed(2)}MB). Se comprimirá durante la carga.`);
    }

    return { valid: true };
  }

  private generatePreview(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.state.previewUrl = e.target?.result as string;
    };

    reader.onerror = () => {
      this.state.error = 'Error al generar vista previa';
      this.uploadError.emit(this.state.error);
    };

    reader.readAsDataURL(file);
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
