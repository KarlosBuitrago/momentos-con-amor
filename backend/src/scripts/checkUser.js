const { db } = require('../config/firebase');

async function checkUser() {
  try {
    console.log('Verificando usuarios en Firestore...\n');
    
    const usersCollection = db.collection('users');
    const snapshot = await usersCollection.get();
    
    if (snapshot.empty) {
      console.log('❌ No hay usuarios en Firestore');
      console.log('\nEjecuta: npm run create-admin-simple');
      return;
    }
    
    console.log(`✅ Encontrados ${snapshot.size} usuario(s):\n`);
    
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log('---');
      console.log('ID:', doc.id);
      console.log('Email:', data.email ? '***@***.***' : 'N/A');
      console.log('Nombre:', data.firstName || 'N/A', data.lastName || '');
      console.log('Role:', data.role);
      console.log('---\n');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

if (require.main === module) {
  checkUser()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = checkUser;
