#!/usr/bin/env node

/**
 * Script para ayudar a configurar Firebase Service Account
 * 
 * Este script te guía para obtener las credenciales necesarias
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔥 Configuración de Firebase Service Account\n');
console.log('═══════════════════════════════════════════════\n');

console.log('Para usar Firebase Firestore en el backend, necesitas credenciales de Service Account.\n');
console.log('Pasos para obtenerlas:\n');
console.log('1. Ve a: https://console.firebase.google.com/project/react-firebase-dbc76/settings/serviceaccounts/adminsdk');
console.log('2. Haz clic en "Generate new private key"');
console.log('3. Descarga el archivo JSON\n');

rl.question('¿Ya descargaste el archivo JSON? (s/n): ', (answer) => {
  if (answer.toLowerCase() === 's' || answer.toLowerCase() === 'si') {
    rl.question('\nIngresa la ruta completa del archivo JSON descargado: ', (filePath) => {
      const resolvedPath = path.resolve(filePath.trim().replace(/['"]/g, ''));
      
      if (!fs.existsSync(resolvedPath)) {
        console.error('\n❌ Error: El archivo no existe en la ruta especificada.');
        console.log('Ruta buscada:', resolvedPath);
        rl.close();
        return;
      }

      try {
        // Leer y validar el archivo
        const credentials = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
        
        if (!credentials.type || credentials.type !== 'service_account') {
          console.error('\n❌ Error: El archivo no parece ser un Service Account válido.');
          rl.close();
          return;
        }

        // Copiar el archivo a la carpeta backend
        const destPath = path.join(__dirname, 'firebase-credentials.json');
        fs.copyFileSync(resolvedPath, destPath);
        console.log('\n✅ Archivo copiado a:', destPath);

        // Actualizar .env
        const envPath = path.join(__dirname, '.env');
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        // Agregar o actualizar GOOGLE_APPLICATION_CREDENTIALS
        if (envContent.includes('GOOGLE_APPLICATION_CREDENTIALS=')) {
          envContent = envContent.replace(
            /GOOGLE_APPLICATION_CREDENTIALS=.*/,
            'GOOGLE_APPLICATION_CREDENTIALS=./firebase-credentials.json'
          );
        } else {
          envContent += '\n\n# Firebase Service Account Path\nGOOGLE_APPLICATION_CREDENTIALS=./firebase-credentials.json\n';
        }
        
        fs.writeFileSync(envPath, envContent);
        console.log('✅ Archivo .env actualizado');

        // Actualizar .gitignore
        const gitignorePath = path.join(__dirname, '.gitignore');
        let gitignoreContent = '';
        
        if (fs.existsSync(gitignorePath)) {
          gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
        }
        
        if (!gitignoreContent.includes('firebase-credentials.json')) {
          gitignoreContent += '\n# Firebase credentials\nfirebase-credentials.json\n';
          fs.writeFileSync(gitignorePath, gitignoreContent);
          console.log('✅ Archivo .gitignore actualizado');
        }

        console.log('\n🎉 ¡Configuración completada!\n');
        console.log('Ahora puedes iniciar el backend:');
        console.log('  npm run dev\n');
        console.log('Deberías ver: "Firebase inicializado con credenciales de servicio."\n');

      } catch (error) {
        console.error('\n❌ Error al procesar el archivo:', error.message);
      }
      
      rl.close();
    });
  } else {
    console.log('\n📝 Por favor, sigue estos pasos:\n');
    console.log('1. Abre: https://console.firebase.google.com/project/react-firebase-dbc76/settings/serviceaccounts/adminsdk');
    console.log('2. Haz clic en "Generate new private key"');
    console.log('3. Descarga el archivo JSON');
    console.log('4. Ejecuta este script nuevamente: node setup-firebase.js\n');
    rl.close();
  }
});
