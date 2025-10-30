# Design Document

## Overview

This feature adds local image upload capability to the admin product forms (add and edit). Instead of requiring administrators to provide external URLs, they can select images directly from their computer. The system will use the existing `SmartImageUploadService` to handle uploads intelligently, choosing between Firebase Storage and Base64 encoding based on availability and file size.

## Architecture

### Component Structure

```
AdminAddProductComponent / AdminEditProductComponent
    ├── ImageUploadButtonComponent (new)
    │   ├── File input (hidden)
    │   ├── Upload button
    │   ├── Image preview
    │   └── File info display
    └── SmartImageUploadService (existing)
        ├── ImageUploadService (Firebase Storage)
        └── ImageBase64Service (Base64 fallback)
```

### Data Flow

1. User clicks "Cargar desde equipo" button
2. Browser file picker opens (accept: .png, .jpg, .jpeg, .gif, .webp)
3. User selects image file
4. Component validates file (type, size)
5. Component generates preview using FileReader API
6. On form submit, component uploads file via SmartImageUploadService
7. Service returns URL (Firebase Storage URL or Base64 string)
8. URL is saved with product data

## Components and Interfaces

### New Component: ImageUploadButtonComponent

A reusable component for uploading images with preview functionality.

**Location:** `frontend/tienda-ropa/src/app/components/shared/image-upload-button/image-upload-button.component.ts`

**Inputs:**
- `currentImageUrl?: string` - Current image URL to display
- `label: string` - Button label (default: "Cargar desde equipo")
- `maxSizeMB: number` - Maximum file size in MB (default: 5)
- `required: boolean` - Whether image is required (default: false)

**Outputs:**
- `imageSelected: EventEmitter<File>` - Emits when file is selected
- `imageCleared: EventEmitter<void>` - Emits when selection is cleared
- `uploadComplete: EventEmitter<string>` - Emits uploaded image URL
- `uploadError: EventEmitter<string>` - Emits error message

**State:**
```typescript
interface ImageUploadState {
  selectedFile: File | null;
  previewUrl: string | null;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  fileName: string | null;
  fileSize: number | null;
}
```

### Modified Components

#### AdminAddProductComponent
- Add `ImageUploadButtonComponent` for main image
- Add `ImageUploadButtonComponent` for each gallery image
- Handle file selection events
- Upload files on form submit
- Store uploaded URLs in form

#### AdminEditProductComponent
- Same modifications as AdminAddProductComponent
- Pre-populate with existing image URLs

## Data Models

### File Validation Interface

```typescript
interface ImageFileValidation {
  valid: boolean;
  error?: string;
  file?: File;
}
```

### Upload Result (existing in SmartImageUploadService)

```typescript
interface SmartUploadResult {
  url: string;
  isBase64: boolean;
  size: number;
  method: 'storage' | 'base64' | 'fallback';
  message?: string;
}
```

## Error Handling

### Client-Side Validation Errors

1. **Invalid file type**
   - Message: "Formato de archivo no válido. Use PNG, JPG, JPEG, GIF o WebP"
   - Action: Clear selection, show error

2. **File too large**
   - Message: "La imagen es muy grande. Tamaño máximo: 5MB"
   - Action: Show warning, allow upload (will be compressed)

3. **No file selected**
   - Message: "Seleccione una imagen"
   - Action: Prevent form submission if required

### Upload Errors

1. **Network error**
   - Message: "Error de conexión. Verifique su internet"
   - Action: Allow retry

2. **Storage error**
   - Message: "Error al subir a Firebase Storage. Usando Base64 como alternativa"
   - Action: Automatic fallback to Base64

3. **Compression error**
   - Message: "Error al procesar la imagen. Intente con otra imagen"
   - Action: Clear selection, allow retry

## Testing Strategy

### Unit Tests

1. **ImageUploadButtonComponent**
   - File selection triggers event
   - Preview generation works correctly
   - File validation catches invalid types
   - File validation catches oversized files
   - Clear button resets state
   - Upload progress updates correctly

2. **Integration with SmartImageUploadService**
   - Successful upload returns URL
   - Failed upload triggers fallback
   - Base64 encoding works for large files
   - Multiple uploads work independently

### Manual Testing Scenarios

1. **Single image upload**
   - Select valid image → Preview shows → Submit → URL saved
   - Select invalid file → Error shown → Cannot submit
   - Select large file → Warning shown → Upload compresses

2. **Multiple gallery images**
   - Upload 3 different images → All previews show
   - Remove middle image → Others remain
   - Submit → All URLs saved correctly

3. **Mixed URL and file upload**
   - Enter URL for main image → Upload file for gallery
   - Both should work independently

4. **Edit existing product**
   - Load product with existing images → Shows current images
   - Replace main image with upload → New image replaces old
   - Keep some gallery images, replace others → Mixed sources work

5. **Error recovery**
   - Disconnect internet → Upload fails → Error shown
   - Reconnect → Retry → Upload succeeds

## UI/UX Design

### Button Placement

For main image:
```
[URL Input Field                    ]
[Cargar desde equipo] ← New button
[Preview Image]
```

For gallery images:
```
[URL Input Field                    ] [Cargar desde equipo] [Eliminar]
```

### Preview Display

```
┌─────────────────────────┐
│                         │
│    [Image Preview]      │
│                         │
├─────────────────────────┤
│ filename.jpg            │
│ 2.3 MB                  │
│ [X Limpiar selección]   │
└─────────────────────────┘
```

### Loading State

```
[Subiendo imagen... 45%]
[████████░░░░░░░░░░░░]
```

### Error State

```
⚠️ Error al subir la imagen
Formato de archivo no válido
[Intentar de nuevo]
```

## Implementation Notes

### File Input Handling

Use hidden file input with programmatic trigger:

```html
<input #fileInput type="file" accept="image/png,image/jpeg,image/jpg,image/gif,image/webp" 
       (change)="onFileSelected($event)" style="display: none">
<button type="button" (click)="fileInput.click()">Cargar desde equipo</button>
```

### Preview Generation

Use FileReader API for instant preview:

```typescript
const reader = new FileReader();
reader.onload = (e) => {
  this.previewUrl = e.target?.result as string;
};
reader.readAsDataURL(file);
```

### Upload Timing

- **Option 1 (Recommended):** Upload on form submit
  - Pros: Single transaction, easier rollback
  - Cons: Slower submit, all-or-nothing

- **Option 2:** Upload immediately on selection
  - Pros: Faster submit, instant feedback
  - Cons: Orphaned images if form not submitted

**Decision:** Use Option 1 for consistency with current form behavior

### Form Integration

Store selected files in component state:

```typescript
private selectedMainImage: File | null = null;
private selectedGalleryImages: Map<number, File> = new Map();
```

On submit, upload files before creating product:

```typescript
async onSubmit() {
  // Upload main image if selected
  if (this.selectedMainImage) {
    const result = await this.smartUploadService.uploadImage(this.selectedMainImage).toPromise();
    this.form.patchValue({ imageUrl: result.url });
  }
  
  // Upload gallery images
  for (const [index, file] of this.selectedGalleryImages) {
    const result = await this.smartUploadService.uploadImage(file).toPromise();
    this.imageGallery.at(index).setValue(result.url);
  }
  
  // Continue with normal submit
  this.productService.createProductRemote(product).subscribe(...);
}
```

## Performance Considerations

1. **Image Compression**
   - Use existing `ImageBase64Service` compression (800x800, 0.8 quality)
   - Reduces upload time and storage usage

2. **Lazy Loading**
   - Preview images use `loading="lazy"` attribute
   - Reduces initial page load

3. **Parallel Uploads**
   - Upload multiple gallery images in parallel using `Promise.all()`
   - Faster than sequential uploads

4. **Progress Feedback**
   - Show upload progress for files > 1MB
   - Prevents user confusion during slow uploads

## Security Considerations

1. **File Type Validation**
   - Client-side: Check file extension and MIME type
   - Server-side: Firebase Storage validates file types

2. **File Size Limits**
   - Client-side: Warn at 5MB, compress before upload
   - Server-side: Firebase Storage has built-in limits

3. **Sanitization**
   - File names are sanitized by Firebase Storage
   - No user-provided file names in URLs

4. **Access Control**
   - Only authenticated admin users can upload
   - Firebase Storage rules enforce authentication

## Accessibility

1. **Keyboard Navigation**
   - File input accessible via Tab key
   - Button triggers file picker on Enter/Space

2. **Screen Reader Support**
   - Button has descriptive label
   - Preview has alt text
   - Error messages announced

3. **Visual Feedback**
   - Clear focus indicators
   - High contrast error messages
   - Loading states visible

## Browser Compatibility

- **File API:** Supported in all modern browsers
- **FileReader API:** Supported in all modern browsers
- **File input accept attribute:** Supported in all modern browsers
- **Fallback:** Not needed, admin panel requires modern browser
