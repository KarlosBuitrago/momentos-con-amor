const express = require('express');
const router = express.Router();
const customizationController = require('../controllers/customizationController');
const { requireAdmin } = require('../middleware/authMiddleware');

// Rutas públicas (no requieren autenticación)
router.get('/', customizationController.getAllCustomizations);
router.get('/search', customizationController.searchCustomizations);
router.get('/:id', customizationController.getCustomizationById);
router.post('/batch', customizationController.getCustomizationsByIds);

// Rutas protegidas (solo administradores)
router.post('/', requireAdmin, customizationController.createCustomization);
router.put('/:id', requireAdmin, customizationController.updateCustomization);
router.delete('/:id', requireAdmin, customizationController.deleteCustomization);

module.exports = router;
