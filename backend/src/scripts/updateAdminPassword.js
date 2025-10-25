const { db } = require('../config/firebase');
const bcrypt = require('bcrypt');

async function updateAdminPassword() {
  try {
    console.log('Actualizando contraseña del administrador...');
    
    const adminEmail = 'admin@tiendaropa.com';
    const adminPassword = 'Admin123!';
    
    const usersCollection = db.collection('users');
    
    // Buscar usuario por email
    const snapshot = await usersCollection.where('email', '==', adminEmail).limit(1).get();
    
    if (snapshot.empty) {
      console.log('❌ Usuario admin no encontrado');
      console.log('Ejecuta: npm run create-admin-simple');
      return;
    }
    
    const userDoc = snapshot.docs[0];
    const userId = userDoc.id;
    
    // Hashear contraseña
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    
    // Actualizar usuario
    await usersCollection.doc(userId).update({
      passwordHash,
      updatedAt: new Date()
    });
    
    console.log('\n✅ Contraseña actualizada exitosamente');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Contraseña: Admin123!');
    console.log('\n⚠️ IMPORTANTE: Cambia esta contraseña después del primer inicio de sesión.');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

if (require.main === module) {
  updateAdminPassword()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = updateAdminPassword;
