const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const { requireAdmin } = require('../middleware/authMiddleware');

// Rutas públicas (no requieren autenticación)
router.get('/', materialController.getAllMaterials);
router.get('/search', materialController.searchMaterials);
router.get('/:id', materialController.getMaterialById);
router.post('/batch', materialController.getMaterialsByIds);

// Rutas protegidas (solo administradores)
router.post('/', requireAdmin, materialController.createMaterial);
router.put('/:id', requireAdmin, materialController.updateMaterial);
router.delete('/:id', requireAdmin, materialController.deleteMaterial);

module.exports = router;
