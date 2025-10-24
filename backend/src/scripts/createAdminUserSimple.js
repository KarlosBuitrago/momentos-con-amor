const { db } = require('../config/firebase');

async function createAdminUserSimple() {
  try {
    console.log('Creando usuario administrador en Firestore...');
    
    const adminEmail = 'admin@tiendaropa.com';
    const adminId = 'admin-001'; // ID fijo para el admin
    
    const usersCollection = db.collection('users');
    
    // Verificar si el usuario ya existe
    const existingUser = await usersCollection.doc(adminId).get();
    
    if (existingUser.exists) {
      console.log('✅ Usuario admin ya existe');
      return;
    }
    
    // Crear usuario directamente en Firestore
    const userData = {
      uid: adminId,
      email: adminEmail,
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
    console.log('\n⚠️ NOTA: Este usuario solo existe en Firestore.');
    console.log('   Para usar Firebase Auth completo, habilita Authentication en Firebase Console.');
    
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
