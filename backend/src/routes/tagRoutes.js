const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const { requireAdmin } = require('../middleware/authMiddleware');

// Rutas públicas (no requieren autenticación)
router.get('/', tagController.getAllTags);
router.get('/search', tagController.searchTags);
router.get('/:id', tagController.getTagById);
router.post('/batch', tagController.getTagsByIds);

// Rutas protegidas (solo administradores)
router.post('/', requireAdmin, tagController.createTag);
router.put('/:id', requireAdmin, tagController.updateTag);
router.delete('/:id', requireAdmin, tagController.deleteTag);

module.exports = router;
