const { db } = require('../config/firebase');

const customizationsCollection = db.collection('customizations');

class Customization {
  /**
   * Obtener todas las personalizaciones con filtros opcionales
   */
  static async getAll(filters = {}) {
    try {
      let query = customizationsCollection;
      
      // Filtrar por categoría
      if (filters.category) {
        query = query.where('category', '==', filters.category);
      }
      
      // Filtrar por estado activo
      if (filters.isActive !== undefined) {
        const active = typeof filters.isActive === 'string'
          ? filters.isActive.toLowerCase() !== 'false'
          : Boolean(filters.isActive);
        query = query.where('isActive', '==', active);
      }
      
      // Filtrar por aplicabilidad
      if (filters.applicableTo) {
        query = query.where('applicableTo', 'array-contains', filters.applicableTo);
      }
      
      const snapshot = await query.get();
      let results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Ordenar en memoria para evitar índices compuestos
      results.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      
      return results;
    } catch (error) {
      console.error('Error al obtener personalizaciones:', error);
      throw error;
    }
  }

  /**
   * Obtener una personalización por ID
   */
  static async getById(id) {
    try {
      const doc = await customizationsCollection.doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      console.error(`Error al obtener personalización con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtener múltiples personalizaciones por IDs
   */
  static async getByIds(ids) {
    try {
      if (!ids || ids.length === 0) {
        return [];
      }

      // Firestore limita a 10 elementos en 'in', dividir si es necesario
      const chunks = [];
      for (let i = 0; i < ids.length; i += 10) {
        chunks.push(ids.slice(i, i + 10));
      }

      const results = [];
      for (const chunk of chunks) {
        const snapshot = await customizationsCollection
          .where(db.FieldPath.documentId(), 'in', chunk)
          .get();
        
        snapshot.docs.forEach(doc => {
          results.push({
            id: doc.id,
            ...doc.data()
          });
        });
      }

      return results;
    } catch (error) {
      console.error('Error al obtener personalizaciones por IDs:', error);
      throw error;
    }
  }

  /**
   * Buscar personalizaciones por nombre
   */
  static async search(searchTerm) {
    try {
      const snapshot = await customizationsCollection
        .where('isActive', '==', true)
        .orderBy('name')
        .get();
      
      // Filtrar en memoria (Firestore no soporta búsqueda de texto completo)
      const results = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(custom => 
          custom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          custom.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      return results;
    } catch (error) {
      console.error('Error al buscar personalizaciones:', error);
      throw error;
    }
  }

  /**
   * Crear una nueva personalización
   */
  static async create(customizationData) {
    try {
      const { id, ...rest } = customizationData;
      
      const payload = {
        ...rest,
        isActive: rest.isActive !== undefined ? rest.isActive : true,
        sortOrder: rest.sortOrder || 999,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (id) {
        await customizationsCollection.doc(id).set(payload, { merge: true });
        return { id, ...payload };
      }

      const docRef = await customizationsCollection.add(payload);
      return {
        id: docRef.id,
        ...payload
      };
    } catch (error) {
      console.error('Error al crear personalización:', error);
      throw error;
    }
  }

  /**
   * Actualizar una personalización existente
   */
  static async update(id, customizationData) {
    try {
      await customizationsCollection.doc(id).update({
        ...customizationData,
        updatedAt: new Date()
      });

      const updatedDoc = await customizationsCollection.doc(id).get();
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };
    } catch (error) {
      console.error(`Error al actualizar personalización con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar una personalización
   */
  static async delete(id) {
    try {
      await customizationsCollection.doc(id).delete();
      return { id };
    } catch (error) {
      console.error(`Error al eliminar personalización con ID ${id}:`, error);
      throw error;
    }
  }
}

module.exports = Customization;
