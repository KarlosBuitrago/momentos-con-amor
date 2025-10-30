const { db } = require('../config/firebase');

const materialsCollection = db.collection('materials');

class Material {
  /**
   * Obtener todos los materiales con filtros opcionales
   */
  static async getAll(filters = {}) {
    try {
      let query = materialsCollection;
      
      // Filtrar por tipo
      if (filters.type) {
        query = query.where('type', '==', filters.type);
      }
      
      // Filtrar por estado activo
      if (filters.isActive !== undefined) {
        const active = typeof filters.isActive === 'string'
          ? filters.isActive.toLowerCase() !== 'false'
          : Boolean(filters.isActive);
        query = query.where('isActive', '==', active);
      }
      
      const snapshot = await query.get();
      let results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Ordenar en memoria para evitar índices compuestos
      results.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      
      return results;
    } catch (error) {
      console.error('Error al obtener materiales:', error);
      throw error;
    }
  }

  /**
   * Obtener un material por ID
   */
  static async getById(id) {
    try {
      const doc = await materialsCollection.doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      console.error(`Error al obtener material con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtener múltiples materiales por IDs
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
        const snapshot = await materialsCollection
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
      console.error('Error al obtener materiales por IDs:', error);
      throw error;
    }
  }

  /**
   * Buscar materiales por nombre
   */
  static async search(searchTerm) {
    try {
      const snapshot = await materialsCollection
        .where('isActive', '==', true)
        .orderBy('name')
        .get();
      
      // Filtrar en memoria
      const results = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(material => 
          material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          material.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          material.brand?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      return results;
    } catch (error) {
      console.error('Error al buscar materiales:', error);
      throw error;
    }
  }

  /**
   * Crear un nuevo material
   */
  static async create(materialData) {
    try {
      const { id, ...rest } = materialData;
      
      const payload = {
        ...rest,
        isActive: rest.isActive !== undefined ? rest.isActive : true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (id) {
        await materialsCollection.doc(id).set(payload, { merge: true });
        return { id, ...payload };
      }

      const docRef = await materialsCollection.add(payload);
      return {
        id: docRef.id,
        ...payload
      };
    } catch (error) {
      console.error('Error al crear material:', error);
      throw error;
    }
  }

  /**
   * Actualizar un material existente
   */
  static async update(id, materialData) {
    try {
      await materialsCollection.doc(id).update({
        ...materialData,
        updatedAt: new Date()
      });

      const updatedDoc = await materialsCollection.doc(id).get();
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };
    } catch (error) {
      console.error(`Error al actualizar material con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar un material
   */
  static async delete(id) {
    try {
      await materialsCollection.doc(id).delete();
      return { id };
    } catch (error) {
      console.error(`Error al eliminar material con ID ${id}:`, error);
      throw error;
    }
  }
}

module.exports = Material;
