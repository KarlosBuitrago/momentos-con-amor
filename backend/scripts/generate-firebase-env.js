#!/usr/bin/env node

/**
 * Script para generar la variable de entorno FIREBASE_SERVICE_ACCOUNT
 * Uso: node scripts/generate-firebase-env.js
 */

const fs = require('fs');
const path = require('path');

const credentialsPath = path.join(__dirname, '../react-firebase-dbc76-firebase-adminsdk-z2n37-911e39435e.json');

try {
  if (!fs.existsSync(credentialsPath)) {
    console.error('❌ Archivo de credenciales no encontrado en:', credentialsPath);
    process.exit(1);
  }

  const credentials = fs.readFileSync(credentialsPath, 'utf8');
  const minified = JSON.stringify(JSON.parse(credentials));

  console.log('\n✅ Variable de entorno generada:\n');
  console.log('FIREBASE_SERVICE_ACCOUNT=' + minified);
  console.log('\n📋 Copia la línea completa de arriba y agrégala como variable de entorno en Render.\n');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
