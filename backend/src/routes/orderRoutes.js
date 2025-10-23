const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../controllers/authController');

// Rutas públicas
router.post('/', orderController.createOrder);

// Rutas protegidas (requieren autenticación)
router.get('/', verifyToken, orderController.getAllOrders);
router.get('/user/:userId', verifyToken, orderController.getOrdersByUser);
router.get('/:id', verifyToken, orderController.getOrderById);
router.put('/:id', verifyToken, orderController.updateOrder);
router.patch('/:id/status', verifyToken, orderController.updateOrderStatus);
router.delete('/:id', verifyToken, orderController.deleteOrder);

module.exports = router;