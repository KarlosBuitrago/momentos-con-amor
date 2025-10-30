# Requirements Document

## Introduction

This feature enables administrators to upload product images directly from their local computer instead of requiring external URLs. The system will provide a file picker dialog for selecting images (PNG, JPG, JPEG, GIF, WebP) and automatically handle the upload process using the existing smart image upload service that chooses between Firebase Storage and Base64 encoding based on availability and file size.

## Glossary

- **Admin Panel**: The administrative interface where store managers create and edit products
- **Image Upload System**: The backend service that handles image storage via Firebase Storage or Base64 encoding
- **File Picker**: A browser dialog that allows users to select files from their local file system
- **Product Form**: The form component used for adding or editing product information
- **Image Preview**: A visual representation of the selected image before saving

## Requirements

### Requirement 1

**User Story:** As a store administrator, I want to upload product images from my local computer, so that I can add products without needing to host images externally first

#### Acceptance Criteria

1. WHEN the administrator clicks the "Cargar desde equipo" button, THE Admin Panel SHALL open a file picker dialog
2. THE Admin Panel SHALL accept image files with extensions .png, .jpg, .jpeg, .gif, and .webp
3. WHEN a valid image file is selected, THE Admin Panel SHALL display a preview of the selected image
4. WHEN the image file size exceeds 5MB, THE Admin Panel SHALL display a warning message to the administrator
5. WHEN the form is submitted with a local image, THE Admin Panel SHALL upload the image using the Smart Image Upload Service

### Requirement 2

**User Story:** As a store administrator, I want to see a preview of the image I selected, so that I can verify it's the correct image before saving the product

#### Acceptance Criteria

1. WHEN an image file is selected, THE Admin Panel SHALL display the image preview within 2 seconds
2. THE Admin Panel SHALL show the filename and file size below the preview
3. WHEN the administrator selects a different image, THE Admin Panel SHALL replace the previous preview with the new image
4. THE Admin Panel SHALL maintain the image preview until the form is submitted or reset

### Requirement 3

**User Story:** As a store administrator, I want the option to use either a URL or upload a local file, so that I have flexibility in how I provide product images

#### Acceptance Criteria

1. THE Admin Panel SHALL display both the URL input field and the "Cargar desde equipo" button
2. WHEN a local image is selected, THE Admin Panel SHALL disable the URL input field
3. WHEN the administrator clears the local image selection, THE Admin Panel SHALL re-enable the URL input field
4. THE Admin Panel SHALL use the local image if both URL and local file are provided

### Requirement 4

**User Story:** As a store administrator, I want to add multiple images to the product gallery from my computer, so that I can showcase products from different angles

#### Acceptance Criteria

1. THE Admin Panel SHALL provide a "Cargar desde equipo" button for each image gallery entry
2. WHEN the administrator adds a new gallery image slot, THE Admin Panel SHALL include the upload button for that slot
3. THE Admin Panel SHALL allow uploading different images for the main product image and gallery images
4. WHEN gallery images are uploaded, THE Admin Panel SHALL display previews for each gallery image

### Requirement 5

**User Story:** As a store administrator, I want to receive clear feedback if an image upload fails, so that I can take corrective action

#### Acceptance Criteria

1. WHEN an image upload fails, THE Admin Panel SHALL display an error message with the failure reason
2. WHEN the selected file is not a valid image format, THE Admin Panel SHALL display a message "Formato de archivo no válido. Use PNG, JPG, JPEG, GIF o WebP"
3. WHEN the upload service is unavailable, THE Admin Panel SHALL display a message "Error al subir la imagen. Intente nuevamente"
4. THE Admin Panel SHALL allow the administrator to retry the upload after a failure
5. WHEN an upload is in progress, THE Admin Panel SHALL display a loading indicator
