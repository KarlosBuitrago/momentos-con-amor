const { auth, db } = require('../config/firebase');

async function createAdminUser() {
  try {
    console.log('Creando usuario administrador...');
    
    const adminEmail = 'admin@tiendaropa.com';
    const adminPassword = 'admin123';
    
    // Verificar si el usuario ya existe
    const usersCollection = db.collection('users');
    const existingUser = await usersCollection.where('email', '==', adminEmail).limit(1).get();
    
    if (!existingUser.empty) {
      console.log('✅ Usuario admin ya existe');
      const doc = existingUser.docs[0];
      console.log('ID:', doc.id);
      console.log('Datos:', doc.data());
      return;
    }
    
    // Crear usuario en Firebase Auth
    let userRecord;
    try {
      userRecord = await auth.createUser({
        email: adminEmail,
        password: adminPassword,
        displayName: 'Administrador'
      });
      console.log('✅ Usuario creado en Firebase Auth');
    } catch (authError) {
      if (authError.code === 'auth/email-already-exists') {
        console.log('⚠️ Usuario ya existe en Auth');
        userRecord = await auth.getUserByEmail(adminEmail);
      } else {
        throw authError;
      }
    }
    
    // Guardar datos en Firestore
    const userData = {
      uid: userRecord.uid,
      email: adminEmail,
      firstName: 'Admin',
      lastName: 'Sistema',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await usersCollection.doc(userRecord.uid).set(userData, { merge: true });
    console.log('✅ Usuario guardado en Firestore');
    
    console.log('\n✅ Usuario administrador creado exitosamente');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Revisa las variables de entorno para la contraseña');
    
  } catch (error) {
    console.error('❌ Error al crear usuario administrador:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  createAdminUser()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = createAdminUser;
