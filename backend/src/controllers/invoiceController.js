const admin = require('firebase-admin');
const db = admin.firestore();
const { generateInvoicePDF } = require('../utils/pdfGenerator');
const { sendPaymentConfirmationEmail, sendNewOrderNotification } = require('../utils/emailService');

/**
 * Genera un número de factura único
 */
function generateInvoiceNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}-${random}`;
}

/**
 * Calcula los totales de la factura
 */
function calculateTotals(items, taxPercentage = 0, shipping = 0, discount = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = (subtotal * taxPercentage) / 100;
  const total = subtotal + tax + shipping - discount;

  return {
    subtotal,
    tax,
    total
  };
}

/**
 * Genera una factura
 */
exports.generateInvoice = async (req, res) => {
  try {
    const { customer, items, paymentMethod, userId, taxPercentage = 0, shipping = 0, discount = 0 } = req.body;

    // Validar datos requeridos
    if (!customer || !items || !paymentMethod) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Generar número de factura
    const invoiceNumber = generateInvoiceNumber();

    // Calcular totales
    const totals = calculateTotals(items, taxPercentage, shipping, discount);

    // Crear factura
    const invoice = {
      invoiceNumber,
      date: admin.firestore.FieldValue.serverTimestamp(),
      customer,
      items,
      subtotal: totals.subtotal,
      tax: totals.tax,
      taxPercentage,
      discount,
      shipping,
      total: totals.total,
      status: 'pending',
      paymentMethod,
      paymentStatus: 'pending',
      userId: userId || 'guest',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Guardar en Firestore
    const invoiceRef = await db.collection('invoices').add(invoice);

    // Crear orden asociada
    const order = {
      invoiceId: invoiceRef.id,
      invoiceNumber,
      userId: userId || 'guest',
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.unitPrice
      })),
      totalPrice: totals.total,
      shippingDetails: {
        fullName: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        postalCode: customer.postalCode
      },
      paymentMethod,
      status: 'pendiente',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const orderRef = await db.collection('orders').add(order);

    // Actualizar factura con ID de orden
    await invoiceRef.update({ orderId: orderRef.id });

    // Obtener factura creada
    const createdInvoice = await invoiceRef.get();

    res.status(201).json({
      id: invoiceRef.id,
      ...createdInvoice.data()
    });

  } catch (error) {
    console.error('Error generando factura:', error);
    res.status(500).json({ error: 'Error al generar la factura' });
  }
};

/**
 * Obtiene una factura por ID
 */
exports.getInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoiceDoc = await db.collection('invoices').doc(id).get();

    if (!invoiceDoc.exists) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }

    res.json({
      id: invoiceDoc.id,
      ...invoiceDoc.data()
    });

  } catch (error) {
    console.error('Error obteniendo factura:', error);
    res.status(500).json({ error: 'Error al obtener la factura' });
  }
};

/**
 * Obtiene una factura por número
 */
exports.getInvoiceByNumber = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;

    const snapshot = await db.collection('invoices')
      .where('invoiceNumber', '==', invoiceNumber)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }

    const invoiceDoc = snapshot.docs[0];

    res.json({
      id: invoiceDoc.id,
      ...invoiceDoc.data()
    });

  } catch (error) {
    console.error('Error obteniendo factura:', error);
    res.status(500).json({ error: 'Error al obtener la factura' });
  }
};

/**
 * Confirma el pago de una factura
 */
exports.confirmPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const invoiceRef = db.collection('invoices').doc(id);
    const invoiceDoc = await invoiceRef.get();

    if (!invoiceDoc.exists) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }

    const invoiceData = invoiceDoc.data();

    // Verificar que no esté ya pagada
    if (invoiceData.paymentStatus === 'confirmed') {
      return res.status(400).json({ error: 'La factura ya está pagada' });
    }

    // Actualizar factura
    await invoiceRef.update({
      paymentStatus: 'confirmed',
      status: 'paid',
      paidAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Actualizar orden asociada
    if (invoiceData.orderId) {
      await db.collection('orders').doc(invoiceData.orderId).update({
        status: 'confirmado',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // Obtener factura actualizada
    const updatedInvoice = await invoiceRef.get();
    const updatedInvoiceData = {
      id: invoiceRef.id,
      ...updatedInvoice.data()
    };

    // Enviar email de confirmación al cliente (asíncrono)
    sendPaymentConfirmationEmail(updatedInvoiceData)
      .then(result => {
        if (result.success) {
          console.log('✅ Email de confirmación enviado al cliente:', invoiceData.customer.email);
        } else {
          console.error('❌ Error enviando email al cliente:', result.error);
        }
      })
      .catch(error => {
        console.error('❌ Error enviando email al cliente:', error);
      });

    // Enviar notificación al admin (asíncrono)
    sendNewOrderNotification(updatedInvoiceData)
      .catch(error => {
        console.error('❌ Error enviando notificación al admin:', error);
      });

    res.json(updatedInvoiceData);

  } catch (error) {
    console.error('Error confirmando pago:', error);
    res.status(500).json({ error: 'Error al confirmar el pago' });
  }
};

/**
 * Cancela una factura
 */
exports.cancelInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const invoiceRef = db.collection('invoices').doc(id);
    const invoiceDoc = await invoiceRef.get();

    if (!invoiceDoc.exists) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }

    const invoiceData = invoiceDoc.data();

    // Verificar que no esté pagada
    if (invoiceData.paymentStatus === 'confirmed') {
      return res.status(400).json({ error: 'No se puede cancelar una factura pagada' });
    }

    // Actualizar factura
    await invoiceRef.update({
      status: 'cancelled',
      paymentStatus: 'rejected',
      cancellationReason: reason || 'Cancelado por el usuario',
      cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Actualizar orden asociada
    if (invoiceData.orderId) {
      await db.collection('orders').doc(invoiceData.orderId).update({
        status: 'cancelado',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    res.json({ success: true, message: 'Factura cancelada correctamente' });

  } catch (error) {
    console.error('Error cancelando factura:', error);
    res.status(500).json({ error: 'Error al cancelar la factura' });
  }
};

/**
 * Lista facturas de un usuario
 */
exports.getUserInvoices = async (req, res) => {
  try {
    const { userId } = req.params;

    const snapshot = await db.collection('invoices')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const invoices = [];
    snapshot.forEach(doc => {
      invoices.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(invoices);

  } catch (error) {
    console.error('Error obteniendo facturas:', error);
    res.status(500).json({ error: 'Error al obtener las facturas' });
  }
};

/**
 * Genera y descarga la factura en PDF
 */
exports.downloadInvoicePDF = async (req, res) => {
  try {
    const { id } = req.params;

    const invoiceDoc = await db.collection('invoices').doc(id).get();

    if (!invoiceDoc.exists) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }

    const invoiceData = {
      id: invoiceDoc.id,
      ...invoiceDoc.data()
    };

    // Generar PDF
    const pdfDoc = generateInvoicePDF(invoiceData);

    // Configurar headers para descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Factura-${invoiceData.invoiceNumber}.pdf"`);

    // Enviar PDF como stream
    pdfDoc.pipe(res);
    pdfDoc.end();

  } catch (error) {
    console.error('Error generando PDF:', error);
    res.status(500).json({ error: 'Error al generar el PDF de la factura' });
  }
};

/**
 * Envía la factura por email manualmente
 */
exports.sendInvoiceByEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const invoiceDoc = await db.collection('invoices').doc(id).get();

    if (!invoiceDoc.exists) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }

    const invoiceData = {
      id: invoiceDoc.id,
      ...invoiceDoc.data()
    };

    // Si no se proporciona email, usar el del cliente
    const targetEmail = email || invoiceData.customer.email;

    // Enviar email
    const result = await sendPaymentConfirmationEmail({
      ...invoiceData,
      customer: {
        ...invoiceData.customer,
        email: targetEmail
      }
    });

    if (result.success) {
      res.json({ 
        success: true, 
        message: `Factura enviada exitosamente a ${targetEmail}`,
        messageId: result.messageId
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: result.error,
        message: result.message
      });
    }

  } catch (error) {
    console.error('Error enviando factura por email:', error);
    res.status(500).json({ error: 'Error al enviar la factura por email' });
  }
};
