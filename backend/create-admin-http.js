/**
 * Script para crear usuario administrador vía HTTP
 * Ejecuta este script mientras el backend está corriendo
 */

const http = require('http');

const adminData = JSON.stringify({
  email: 'admin@tiendaropa.com',
  password: 'Admin123!',
  firstName: 'Administrador',
  lastName: 'Principal',
  role: 'admin'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': adminData.length
  }
};

console.log('\n🔐 Creando Usuario Administrador vía HTTP\n');
console.log('═══════════════════════════════════════════\n');

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      if (res.statusCode === 201) {
        console.log('✅ Usuario administrador creado exitosamente!\n');
        console.log('Credenciales de acceso:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`Email:    admin@tiendaropa.com`);
        console.log(`Password: Admin123!`);
        console.log(`Role:     admin`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('⚠️  IMPORTANTE: Guarda estas credenciales en un lugar seguro.\n');
      } else {
        console.log('Respuesta del servidor:', response);
      }
    } catch (error) {
      console.error('Error al parsear respuesta:', error);
      console.log('Respuesta raw:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ Error al crear usuario:', error.message);
  console.log('\nAsegúrate de que el backend esté corriendo en http://localhost:3000\n');
});

req.write(adminData);
req.end();
