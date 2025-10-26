const nodemailer = require('nodemailer');
const { generateInvoicePDF } = require('./pdfGenerator');

/**
 * Configuración del transportador de email
 * Usando Gmail como ejemplo, pero se puede cambiar por cualquier proveedor
 */
function createTransporter() {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'tu-email@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'tu-app-password'
    }
  });
}

/**
 * Genera el PDF como buffer para adjuntar al email
 * @param {Object} invoice - Datos de la factura
 * @returns {Promise<Buffer>} - Buffer del PDF
 */
function generatePDFBuffer(invoice) {
  return new Promise((resolve, reject) => {
    try {
      const doc = generateInvoicePDF(invoice);
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Envía email de confirmación de pago con factura adjunta
 * @param {Object} invoice - Datos de la factura
 * @returns {Promise} - Resultado del envío
 */
async function sendPaymentConfirmationEmail(invoice) {
  try {
    // Si no hay configuración de email, solo logear y retornar éxito
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('⚠️  Email no configurado. Saltando envío de email.');
      return {
        success: true,
        message: 'Email no configurado (modo desarrollo)'
      };
    }

    const transporter = createTransporter();
    
    // Generar PDF como buffer
    const pdfBuffer = await generatePDFBuffer(invoice);
    
    // Configurar el email
    const mailOptions = {
      from: {
        name: 'Momentos con Amor',
        address: process.env.EMAIL_USER || 'contacto@momentosconamor.com'
      },
      to: invoice.customer.email,
      subject: `✅ Pago Confirmado - Factura ${invoice.invoiceNumber}`,
      html: generatePaymentConfirmationHTML(invoice),
      attachments: [
        {
          filename: `Factura-${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };
    
    // Enviar email
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email enviado exitosamente:', result.messageId);
    return {
      success: true,
      messageId: result.messageId,
      message: 'Email enviado correctamente'
    };
    
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return {
      success: false,
      error: error.message,
      message: 'Error al enviar el email'
    };
  }
}

/**
 * Genera el HTML del email de confirmación
 * @param {Object} invoice - Datos de la factura
 * @returns {string} - HTML del email
 */
function generatePaymentConfirmationHTML(invoice) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    
    // Si es un timestamp de Firestore
    if (date._seconds) {
      date = new Date(date._seconds * 1000);
    } else if (!(date instanceof Date)) {
      date = new Date(date);
    }

    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Pago</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #007bff;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #007bff;
          margin-bottom: 10px;
        }
        .success-icon {
          font-size: 48px;
          color: #28a745;
          margin: 20px 0;
        }
        .total-amount {
          font-size: 28px;
          font-weight: bold;
          color: #28a745;
          text-align: center;
          margin: 20px 0;
          padding: 15px;
          background: #d4edda;
          border-radius: 8px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #f1f3f4;
          text-align: center;
          color: #6c757d;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Momentos con Amor</div>
          <p>Tienda de Muñecos Artesanales</p>
          <div class="success-icon">✅</div>
          <h1 style="color: #28a745; margin: 0;">¡Pago Confirmado!</h1>
        </div>

        <p>Hola <strong>${invoice.customer.name}</strong>,</p>
        <p>Tu pago ha sido confirmado exitosamente.</p>

        <div class="total-amount">
          Total Pagado: ${formatCurrency(invoice.total)}
        </div>

        <p><strong>Número de Factura:</strong> ${invoice.invoiceNumber}</p>
        <p><strong>Fecha:</strong> ${formatDate(invoice.date)}</p>
        <p><strong>Método de Pago:</strong> ${invoice.paymentMethod.toUpperCase()}</p>

        <p>Tu factura está adjunta a este email en formato PDF.</p>

        <div class="footer">
          <p><strong>¡Gracias por tu compra!</strong></p>
          <p>📧 contacto@momentosconamor.com | 📱 +57 300 123 4567</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Envía email de notificación de nueva orden (para el admin)
 * @param {Object} invoice - Datos de la factura
 * @returns {Promise} - Resultado del envío
 */
async function sendNewOrderNotification(invoice) {
  try {
    // Si no hay configuración de email, solo logear
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || !process.env.ADMIN_EMAIL) {
      console.log('⚠️  Email de admin no configurado. Saltando notificación.');
      return;
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'Sistema Momentos con Amor',
        address: process.env.EMAIL_USER
      },
      to: process.env.ADMIN_EMAIL,
      subject: `🛍️ Nueva Orden Confirmada - ${invoice.invoiceNumber}`,
      html: `
        <h2>Nueva Orden Confirmada</h2>
        <p><strong>Factura:</strong> ${invoice.invoiceNumber}</p>
        <p><strong>Cliente:</strong> ${invoice.customer.name}</p>
        <p><strong>Email:</strong> ${invoice.customer.email}</p>
        <p><strong>Teléfono:</strong> ${invoice.customer.phone}</p>
        <p><strong>Total:</strong> ${new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0
        }).format(invoice.total)}</p>
        <p><strong>Dirección:</strong> ${invoice.customer.address}, ${invoice.customer.city}</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Notificación de admin enviada');
    
  } catch (error) {
    console.error('❌ Error enviando notificación de admin:', error);
  }
}

module.exports = {
  sendPaymentConfirmationEmail,
  sendNewOrderNotification
};
