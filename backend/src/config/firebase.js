const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const { createMockFirestore, createMockAuth } = require('../utils/mockFirestore');

dotenv.config();

const resolveCredentials = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (error) {
      console.error('No se pudo parsear FIREBASE_SERVICE_ACCOUNT. Asegúrate de que sea JSON válido.');
    }
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const credentialsPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    if (fs.existsSync(credentialsPath)) {
      return require(credentialsPath);
    }
    console.warn(`La ruta GOOGLE_APPLICATION_CREDENTIALS (${credentialsPath}) no existe. Se usará almacenamiento local.`);
  }

  return null;
};

const serviceAccount = resolveCredentials();

let firebaseApp;
let db;
let auth;

if (serviceAccount) {
  const projectId = process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id;

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`
  });

  db = admin.firestore();
  auth = admin.auth();
  console.log('Firebase inicializado con credenciales de servicio.');
} else {
  console.warn('Credenciales de Firebase no encontradas. Usando almacenamiento local en disco (.local-data).');
  db = createMockFirestore();
  auth = createMockAuth();
}

module.exports = {
  admin,
  db,
  auth,
  firebaseApp
};