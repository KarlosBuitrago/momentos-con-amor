const express = require('express');
const router = express.Router();
const {
  generateInvoice,
  getInvoice,
  getInvoiceByNumber,
  confirmPayment,
  cancelInvoice,
  getUserInvoices,
  downloadInvoicePDF,
  sendInvoiceByEmail
} = require('../controllers/invoiceController');

// Generar factura (público - cualquiera puede generar una factura al hacer checkout)
router.post('/generate', generateInvoice);

// Obtener factura por ID
router.get('/:id', getInvoice);

// Obtener factura por número
router.get('/number/:invoiceNumber', getInvoiceByNumber);

// Confirmar pago de una factura
router.post('/:id/confirm-payment', confirmPayment);

// Cancelar una factura
router.post('/:id/cancel', cancelInvoice);

// Obtener facturas de un usuario
router.get('/user/:userId', getUserInvoices);

// Descargar factura en PDF
router.get('/:id/pdf', downloadInvoicePDF);

// Enviar factura por email
router.post('/:id/send-email', sendInvoiceByEmail);

module.exports = router;
