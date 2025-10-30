const { db } = require('../config/firebase');

const tagsCollection = db.collection('tags');

class Tag {
  /**
   * Obtener todos los tags con filtros opcionales
   */
  static async getAll(filters = {}) {
    try {
      let query = tagsCollection;
      
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
      
      const snapshot = await query.get();
      let results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Ordenar en memoria para evitar índices compuestos
      if (filters.sortBy === 'usage') {
        results.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
      } else {
        results.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      }
      
      return results;
    } catch (error) {
      console.error('Error al obtener tags:', error);
      throw error;
    }
  }

  /**
   * Obtener un tag por ID
   */
  static async getById(id) {
    try {
      const doc = await tagsCollection.doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      console.error(`Error al obtener tag con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtener múltiples tags por IDs
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
        const snapshot = await tagsCollection
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
      console.error('Error al obtener tags por IDs:', error);
      throw error;
    }
  }

  /**
   * Buscar tags por nombre
   */
  static async search(searchTerm) {
    try {
      const snapshot = await tagsCollection
        .where('isActive', '==', true)
        .orderBy('name')
        .get();
      
      // Filtrar en memoria
      const results = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(tag => 
          tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tag.slug?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      return results;
    } catch (error) {
      console.error('Error al buscar tags:', error);
      throw error;
    }
  }

  /**
   * Crear un nuevo tag
   */
  static async create(tagData) {
    try {
      const { id, ...rest } = tagData;
      
      // Generar slug si no existe
      const slug = rest.slug || rest.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      const payload = {
        ...rest,
        slug,
        isActive: rest.isActive !== undefined ? rest.isActive : true,
        usageCount: rest.usageCount || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (id) {
        await tagsCollection.doc(id).set(payload, { merge: true });
        return { id, ...payload };
      }

      const docRef = await tagsCollection.add(payload);
      return {
        id: docRef.id,
        ...payload
      };
    } catch (error) {
      console.error('Error al crear tag:', error);
      throw error;
    }
  }

  /**
   * Actualizar un tag existente
   */
  static async update(id, tagData) {
    try {
      await tagsCollection.doc(id).update({
        ...tagData,
        updatedAt: new Date()
      });

      const updatedDoc = await tagsCollection.doc(id).get();
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };
    } catch (error) {
      console.error(`Error al actualizar tag con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Incrementar el contador de uso de un tag
   */
  static async incrementUsage(id) {
    try {
      await tagsCollection.doc(id).update({
        usageCount: db.FieldValue.increment(1),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error(`Error al incrementar uso del tag ${id}:`, error);
      throw error;
    }
  }

  /**
   * Decrementar el contador de uso de un tag
   */
  static async decrementUsage(id) {
    try {
      await tagsCollection.doc(id).update({
        usageCount: db.FieldValue.increment(-1),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error(`Error al decrementar uso del tag ${id}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar un tag
   */
  static async delete(id) {
    try {
      await tagsCollection.doc(id).delete();
      return { id };
    } catch (error) {
      console.error(`Error al eliminar tag con ID ${id}:`, error);
      throw error;
    }
  }
}

module.exports = Tag;
