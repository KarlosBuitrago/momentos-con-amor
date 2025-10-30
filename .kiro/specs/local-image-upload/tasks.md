# Implementation Plan

- [x] 1. Create ImageUploadButtonComponent



  - Create standalone component with file input, preview, and upload button
  - Implement file selection handler with validation
  - Add preview generation using FileReader API
  - Implement clear selection functionality
  - Add loading state with progress indicator
  - Style component with consistent admin panel design

  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 5.5_



- [ ] 2. Integrate ImageUploadButtonComponent into AdminAddProductComponent
- [ ] 2.1 Add ImageUploadButtonComponent to main image section
  - Import and declare ImageUploadButtonComponent
  - Add component to template next to URL input field


  - Wire up event handlers for file selection
  - Store selected file in component state
  - _Requirements: 1.1, 3.1, 3.2_

- [x] 2.2 Add ImageUploadButtonComponent to gallery images

  - Add upload button for each gallery image entry
  - Handle multiple file selections independently
  - Store gallery files in Map structure
  - Update preview display for gallery images
  - _Requirements: 4.1, 4.2, 4.3, 4.4_


- [x] 2.3 Implement upload logic in onSubmit method


  - Upload main image file if selected before form submission
  - Upload all gallery image files in parallel
  - Update form values with uploaded URLs
  - Handle upload errors with user-friendly messages

  - Show loading state during uploads
  - _Requirements: 1.5, 5.1, 5.2, 5.3, 5.4_

- [x] 3. Integrate ImageUploadButtonComponent into AdminEditProductComponent

- [ ] 3.1 Add ImageUploadButtonComponent to edit form
  - Import and declare ImageUploadButtonComponent
  - Add component to template for main and gallery images
  - Pre-populate with existing image URLs
  - _Requirements: 1.1, 3.1_

- [x] 3.2 Implement upload logic in edit form

  - Upload new files on form submission
  - Keep existing URLs if no new file selected
  - Handle mixed URL and file uploads
  - _Requirements: 3.3, 3.4_

- [ ] 4. Add file validation and error handling
  - Validate file types (png, jpg, jpeg, gif, webp)



  - Validate file size (warn at 5MB)
  - Display validation errors in Spanish
  - Handle upload failures with retry option
  - Show appropriate error messages for different failure scenarios
  - _Requirements: 1.2, 1.4, 5.1, 5.2, 5.3, 5.4_

- [ ] 5. Update form styling and UX
  - Style upload button to match admin panel design
  - Add responsive layout for upload button and preview
  - Ensure proper spacing and alignment
  - Add hover and focus states for accessibility
  - Test keyboard navigation
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 6. Test complete upload workflow
  - Test single image upload for main product image
  - Test multiple gallery image uploads
  - Test mixed URL and file upload scenarios
  - Test file validation (invalid types, large files)
  - Test error recovery (network failures, retry)
  - Test edit form with existing images
  - Verify uploaded images display correctly in product catalog
  - _Requirements: All requirements_
