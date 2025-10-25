const { db } = require('../config/firebase');
const bcrypt = require('bcrypt');

async function createAdminUserSimple() {
  try {
    console.log('Creando usuario administrador en Firestore...');
    
    const adminEmail = 'admin@tiendaropa.com';
    const adminPassword = 'Admin123!';
    const adminId = 'admin-001'; // ID fijo para el admin
    
    const usersCollection = db.collection('users');
    
    // Verificar si el usuario ya existe
    const existingUser = await usersCollection.doc(adminId).get();
    
    if (existingUser.exists) {
      console.log('✅ Usuario admin ya existe');
      return;
    }
    
    // Hashear contraseña
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    
    // Crear usuario directamente en Firestore
    const userData = {
      uid: adminId,
      email: adminEmail,
      passwordHash,
      firstName: 'Admin',
      lastName: 'Sistema',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await usersCollection.doc(adminId).set(userData);
    console.log('✅ Usuario guardado en Firestore');
    
    console.log('\n✅ Usuario administrador creado exitosamente');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Contraseña: Admin123!');
    console.log('\n⚠️ IMPORTANTE: Cambia esta contraseña después del primer inicio de sesión.');
    
  } catch (error) {
    console.error('❌ Error al crear usuario administrador:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  createAdminUserSimple()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = createAdminUserSimple;
