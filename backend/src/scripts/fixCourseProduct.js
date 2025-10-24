/**
 * Script para corregir el producto "Aprende crochet en 5 dias"
 * que tiene categoría "Cursos" pero productType "material"
 */

const admin = require('firebase-admin');
const path = require('path');

// Inicializar Firebase Admin
const serviceAccountPath = path.join(__dirname, '../../react-firebase-dbc76-firebase-adminsdk-z2n37-911e39435e.json');
const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function fixCourseProduct() {
  console.log('Buscando producto "Aprende crochet en 5 dias"...');
  
  try {
    const productId = 'vxej4ZxIKM9FZqnjUstn';
    const docRef = db.collection('products').doc(productId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      console.log('Producto no encontrado');
      return;
    }
    
    const productData = doc.data();
    console.log('\nDatos actuales:');
    console.log(`- Nombre: ${productData.name}`);
    console.log(`- Categoría: ${productData.category}`);
    console.log(`- productType: ${productData.productType}`);
    console.log(`- isCourse: ${productData.isCourse}`);
    
    // Actualizar los campos incorrectos
    await docRef.update({
      productType: 'course',
      isCourse: true,
      updatedAt: new Date()
    });
    
    console.log('\n✓ Producto actualizado correctamente');
    console.log('Nuevos valores:');
    console.log('- productType: course');
    console.log('- isCourse: true');
    
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
  }
  
  process.exit(0);
}

fixCourseProduct();
