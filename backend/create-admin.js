#!/usr/bin/env node

/**
 * Script para crear un usuario administrador
 * Uso: node create-admin.js
 */

const User = require('./src/models/User');
require('dotenv').config();

async function createAdmin() {
  console.log('\n🔐 Creando Usuario Administrador\n');
  console.log('═══════════════════════════════════\n');

  const adminData = {
    email: 'admin@tiendaropa.com',
    password: 'Admin123!',
    firstName: 'Administrador',
    lastName: 'Principal',
    role: 'admin'
  };

  try {
    console.log('Creando usuario administrador...');
    const admin = await User.create(adminData);
    
    console.log('\n✅ Usuario administrador creado exitosamente!\n');
    console.log('Credenciales de acceso:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email:    ${adminData.email}`);
    console.log(`Password: ${adminData.password}`);
    console.log(`Role:     ${admin.role}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  IMPORTANTE: Guarda estas credenciales en un lugar seguro.\n');
    console.log('Puedes usar estas credenciales para iniciar sesión en el panel de administración.\n');
    
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      console.error('\n❌ Error: Ya existe un usuario con este email.\n');
      console.log('Credenciales existentes:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`Email:    ${adminData.email}`);
      console.log(`Password: ${adminData.password}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } else {
      console.error('\n❌ Error al crear usuario administrador:', error.message);
    }
    process.exit(1);
  }
}

createAdmin();
