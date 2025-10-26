const PDFDocument = require('pdfkit');

/**
 * Genera un PDF de factura
 * @param {Object} invoice - Datos de la factura
 * @returns {PDFDocument} - Documento PDF
 */
function generateInvoicePDF(invoice) {
  const doc = new PDFDocument({ 
    size: 'A4',
    margin: 50,
    info: {
      Title: `Factura ${invoice.invoiceNumber}`,
      Author: 'Momentos con Amor'
    }
  });

  // Colores
  const primaryColor = '#007bff';
  const secondaryColor = '#6c757d';
  const successColor = '#28a745';

  // ENCABEZADO
  doc.fontSize(24)
     .fillColor(primaryColor)
     .text('Momentos con Amor', 50, 50);

  doc.fontSize(10)
     .fillColor(secondaryColor)
     .text('Tienda de Muñecos Artesanales', 50, 80)
     .text('NIT: 123456789-0', 50, 95)
     .text('Bogotá, Colombia', 50, 110)
     .text('contacto@momentosconamor.com', 50, 125);

  // INFORMACIÓN DE LA FACTURA (Derecha)
  doc.fontSize(20)
     .fillColor(primaryColor)
     .text('FACTURA', 400, 50, { align: 'right' });

  doc.fontSize(10)
     .fillColor(secondaryColor)
     .text(`No: ${invoice.invoiceNumber}`, 400, 80, { align: 'right' })
     .text(`Fecha: ${formatDate(invoice.date)}`, 400, 95, { align: 'right' });

  // Estado de pago
  const statusText = invoice.paymentStatus === 'confirmed' ? 'PAGADO' : 'PENDIENTE';
  const statusColor = invoice.paymentStatus === 'confirmed' ? successColor : '#ffc107';
  
  doc.fontSize(12)
     .fillColor(statusColor)
     .text(statusText, 400, 115, { align: 'right' });

  // LÍNEA SEPARADORA
  doc.moveTo(50, 160)
     .lineTo(550, 160)
     .strokeColor(primaryColor)
     .lineWidth(2)
     .stroke();

  // INFORMACIÓN DEL CLIENTE
  doc.fontSize(12)
     .fillColor('#000')
     .text('Facturar a:', 50, 180);

  doc.fontSize(10)
     .fillColor(secondaryColor)
     .text(invoice.customer.name, 50, 200)
     .text(invoice.customer.email, 50, 215)
     .text(invoice.customer.phone, 50, 230)
     .text(invoice.customer.address, 50, 245)
     .text(`${invoice.customer.city}, ${invoice.customer.postalCode}`, 50, 260);

  // TABLA DE PRODUCTOS
  let yPosition = 300;

  // Encabezados de la tabla
  doc.fontSize(10)
     .fillColor('#fff')
     .rect(50, yPosition, 500, 25)
     .fill('#007bff');

  doc.fillColor('#fff')
     .text('Producto', 60, yPosition + 8)
     .text('Cant.', 320, yPosition + 8)
     .text('Precio Unit.', 380, yPosition + 8)
     .text('Subtotal', 480, yPosition + 8);

  yPosition += 25;

  // Items de la factura
  doc.fillColor('#000');
  
  invoice.items.forEach((item, index) => {
    // Fondo alternado
    if (index % 2 === 0) {
      doc.rect(50, yPosition, 500, 30)
         .fillColor('#f8f9fa')
         .fill();
    }

    doc.fillColor('#000')
       .fontSize(10)
       .text(item.name, 60, yPosition + 8, { width: 240 })
       .text(item.quantity.toString(), 320, yPosition + 8)
       .text(formatCurrency(item.unitPrice), 380, yPosition + 8)
       .text(formatCurrency(item.subtotal), 480, yPosition + 8);

    yPosition += 30;

    // Personalizaciones
    if (item.customizations && item.customizations.length > 0) {
      item.customizations.forEach(custom => {
        doc.fontSize(8)
           .fillColor(secondaryColor)
           .text(`  + ${custom.name} (+${formatCurrency(custom.price)})`, 60, yPosition);
        yPosition += 15;
      });
    }
  });

  // TOTALES
  yPosition += 20;

  doc.moveTo(350, yPosition)
     .lineTo(550, yPosition)
     .strokeColor('#dee2e6')
     .lineWidth(1)
     .stroke();

  yPosition += 15;

  doc.fontSize(10)
     .fillColor(secondaryColor)
     .text('Subtotal:', 350, yPosition)
     .text(formatCurrency(invoice.subtotal), 480, yPosition);

  yPosition += 20;

  if (invoice.tax > 0) {
    doc.text(`IVA (${invoice.taxPercentage}%):`, 350, yPosition)
       .text(formatCurrency(invoice.tax), 480, yPosition);
    yPosition += 20;
  }

  if (invoice.shipping > 0) {
    doc.text('Envío:', 350, yPosition)
       .text(formatCurrency(invoice.shipping), 480, yPosition);
    yPosition += 20;
  }

  if (invoice.discount > 0) {
    doc.text('Descuento:', 350, yPosition)
       .text(`-${formatCurrency(invoice.discount)}`, 480, yPosition);
    yPosition += 20;
  }

  // TOTAL FINAL
  doc.moveTo(350, yPosition)
     .lineTo(550, yPosition)
     .strokeColor(primaryColor)
     .lineWidth(2)
     .stroke();

  yPosition += 15;

  doc.fontSize(14)
     .fillColor(primaryColor)
     .text('TOTAL:', 350, yPosition)
     .text(formatCurrency(invoice.total), 480, yPosition);

  // MÉTODO DE PAGO
  yPosition += 40;

  doc.fontSize(10)
     .fillColor('#000')
     .text('Método de Pago:', 50, yPosition)
     .fillColor(secondaryColor)
     .text(invoice.paymentMethod.toUpperCase(), 150, yPosition);

  // NOTAS
  if (invoice.notes) {
    yPosition += 30;
    doc.fontSize(10)
       .fillColor('#000')
       .text('Notas:', 50, yPosition);
    
    yPosition += 15;
    doc.fontSize(9)
       .fillColor(secondaryColor)
       .text(invoice.notes, 50, yPosition, { width: 500 });
  }

  // PIE DE PÁGINA
  doc.fontSize(8)
     .fillColor(secondaryColor)
     .text(
       'Gracias por tu compra. Para cualquier consulta, contáctanos a contacto@momentosconamor.com',
       50,
       750,
       { align: 'center', width: 500 }
     );

  return doc;
}

/**
 * Formatea una fecha
 */
function formatDate(date) {
  if (!date) return 'N/A';
  
  // Si es un timestamp de Firestore
  if (date._seconds) {
    date = new Date(date._seconds * 1000);
  } else if (!(date instanceof Date)) {
    date = new Date(date);
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Formatea un número como moneda COP
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount);
}

module.exports = {
  generateInvoicePDF
};
