const fs = require('fs');
const path = require('path');

// Script para generar env.js con variables de entorno
// Compatible con Windows y Linux

const API_URL = process.env.API_URL || 'https://momentos-con-amor.onrender.com/api';

const envContent = `(function(window) {
  window.env = window.env || {};
  window.env.API_URL = '${API_URL}';
})(this);
`;

const outputPath = path.join(__dirname, 'dist', 'tienda-ropa', 'browser', 'env.js');
const outputDir = path.dirname(outputPath);

// Crear directorio si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Escribir archivo
fs.writeFileSync(outputPath, envContent, 'utf8');

console.log(`✅ env.js generado con API_URL=${API_URL}`);
