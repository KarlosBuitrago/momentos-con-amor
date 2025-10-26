const express = require('express');
const router = express.Router();
const { 
  upload, 
  uploadSingleImage, 
  uploadMultipleImages, 
  deleteImage 
} = require('../controllers/uploadController');
const { requireAdmin } = require('../middleware/authMiddleware');

// Subir una sola imagen (requiere autenticación admin)
router.post('/image', requireAdmin, upload.single('image'), uploadSingleImage);

// Subir múltiples imágenes (requiere autenticación admin)
router.post('/images', requireAdmin, upload.array('images', 10), uploadMultipleImages);

// Eliminar una imagen (requiere autenticación admin)
router.delete('/image', requireAdmin, deleteImage);

module.exports = router;
