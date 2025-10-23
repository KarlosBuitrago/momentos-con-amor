const { db, auth } = require('../config/firebase');

const usersCollection = db.collection('users');

class User {
  // Obtener todos los usuarios (solo para administradores)
  static async getAll() {
    try {
      const snapshot = await usersCollection.get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        password: undefined // No devolver la contraseña
      }));
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }

  // Obtener un usuario por ID
  static async getById(id) {
    try {
      const doc = await usersCollection.doc(id).get();
      if (!doc.exists) {
        return null;
      }
      const userData = doc.data();
      return {
        id: doc.id,
        ...userData,
        password: undefined // No devolver la contraseña
      };
    } catch (error) {
      console.error(`Error al obtener usuario con ID ${id}:`, error);
      throw error;
    }
  }

  // Obtener un usuario por email
  static async getByEmail(email) {
    try {
      const snapshot = await usersCollection.where('email', '==', email).limit(1).get();
      if (snapshot.empty) {
        return null;
      }
      const doc = snapshot.docs[0];
      const userData = doc.data();
      return {
        id: doc.id,
        ...userData,
        password: undefined // No devolver la contraseña
      };
    } catch (error) {
      console.error(`Error al obtener usuario con email ${email}:`, error);
      throw error;
    }
  }

  // Crear un nuevo usuario
  static async create(userData) {
    try {
      // Crear usuario en Firebase Auth
      const userRecord = await auth.createUser({
        email: userData.email,
        password: userData.password,
        displayName: `${userData.firstName} ${userData.lastName}`
      });
      
      // Guardar datos adicionales en Firestore
      const userDataToSave = {
        uid: userRecord.uid,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'customer',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await usersCollection.doc(userRecord.uid).set(userDataToSave);
      
      return {
        id: userRecord.uid,
        ...userDataToSave,
        password: undefined // No devolver la contraseña
      };
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  // Actualizar un usuario existente
  static async update(id, userData) {
    try {
      // Si se actualiza el email o la contraseña, actualizar en Firebase Auth
      if (userData.email || userData.password) {
        const updateAuthData = {};
        if (userData.email) updateAuthData.email = userData.email;
        if (userData.password) updateAuthData.password = userData.password;
        
        await auth.updateUser(id, updateAuthData);
      }
      
      // Actualizar datos en Firestore
      const userDataToUpdate = {
        ...userData,
        password: undefined, // No guardar la contraseña en Firestore
        updatedAt: new Date()
      };
      
      await usersCollection.doc(id).update(userDataToUpdate);
      
      return {
        id,
        ...userDataToUpdate
      };
    } catch (error) {
      console.error(`Error al actualizar usuario con ID ${id}:`, error);
      throw error;
    }
  }

  // Eliminar un usuario
  static async delete(id) {
    try {
      // Eliminar de Firebase Auth
      await auth.deleteUser(id);
      
      // Eliminar de Firestore
      await usersCollection.doc(id).delete();
      
      return { id };
    } catch (error) {
      console.error(`Error al eliminar usuario con ID ${id}:`, error);
      throw error;
    }
  }
}

module.exports = User;