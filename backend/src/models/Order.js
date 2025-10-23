const { db } = require('../config/firebase');

const ordersCollection = db.collection('orders');

class Order {
  // Obtener todos los pedidos (para administradores)
  static async getAll() {
    try {
      const snapshot = await ordersCollection.get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      throw error;
    }
  }

  // Obtener pedidos de un usuario específico
  static async getByUserId(userId) {
    try {
      const snapshot = await ordersCollection.where('userId', '==', userId).get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error al obtener pedidos del usuario ${userId}:`, error);
      throw error;
    }
  }

  // Obtener un pedido por ID
  static async getById(id) {
    try {
      const doc = await ordersCollection.doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      console.error(`Error al obtener pedido con ID ${id}:`, error);
      throw error;
    }
  }

  // Crear un nuevo pedido
  static async create(orderData) {
    try {
      const docRef = await ordersCollection.add({
        ...orderData,
        status: orderData.status || 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return {
        id: docRef.id,
        ...orderData
      };
    } catch (error) {
      console.error('Error al crear pedido:', error);
      throw error;
    }
  }

  // Actualizar un pedido existente
  static async update(id, orderData) {
    try {
      await ordersCollection.doc(id).update({
        ...orderData,
        updatedAt: new Date()
      });
      
      return {
        id,
        ...orderData
      };
    } catch (error) {
      console.error(`Error al actualizar pedido con ID ${id}:`, error);
      throw error;
    }
  }

  // Actualizar el estado de un pedido
  static async updateStatus(id, status) {
    try {
      await ordersCollection.doc(id).update({
        status,
        updatedAt: new Date()
      });
      
      return { id, status };
    } catch (error) {
      console.error(`Error al actualizar estado del pedido con ID ${id}:`, error);
      throw error;
    }
  }
}

module.exports = Order;