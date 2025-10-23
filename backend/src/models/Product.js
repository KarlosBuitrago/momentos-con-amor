const { db } = require('../config/firebase');

const productsCollection = db.collection('products');

class Product {
  // Obtener todos los productos con filtros opcionales
  static async getAll(filters = {}) {
    try {
      let query = productsCollection;
      
      // Aplicar filtros si existen
      if (filters.category) {
        query = query.where('category', '==', filters.category);
      }
      
      if (filters.targetAudience) {
        query = query.where('targetAudience', '==', filters.targetAudience);
      }
      
      if (filters.minPrice) {
        query = query.where('price', '>=', parseFloat(filters.minPrice));
      }
      
      if (filters.maxPrice) {
        query = query.where('price', '<=', parseFloat(filters.maxPrice));
      }

      if (filters.isAvailable !== undefined) {
        const available = typeof filters.isAvailable === 'string'
          ? filters.isAvailable.toLowerCase() !== 'false'
          : Boolean(filters.isAvailable);
        query = query.where('isAvailable', '==', available);
      }
      
      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  }

  // Obtener un producto por ID
  static async getById(id) {
    try {
      const doc = await productsCollection.doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      console.error(`Error al obtener producto con ID ${id}:`, error);
      throw error;
    }
  }

  // Crear un nuevo producto
  static async create(productData) {
    try {
      const { id, ...rest } = productData;
      const payload = {
        ...rest,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (id) {
        await productsCollection.doc(id).set(payload, { merge: true });
        return { id, ...payload };
      }

      const docRef = await productsCollection.add(payload);
      return {
        id: docRef.id,
        ...payload
      };
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  }

  // Actualizar un producto existente
  static async update(id, productData) {
    try {
      await productsCollection.doc(id).update({
        ...productData,
        updatedAt: new Date()
      });

      const updatedDoc = await productsCollection.doc(id).get();
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };
    } catch (error) {
      console.error(`Error al actualizar producto con ID ${id}:`, error);
      throw error;
    }
  }

  // Eliminar un producto
  static async delete(id) {
    try {
      await productsCollection.doc(id).delete();
      return { id };
    } catch (error) {
      console.error(`Error al eliminar producto con ID ${id}:`, error);
      throw error;
    }
  }

  static async seed(samples = []) {
    if (!Array.isArray(samples) || samples.length === 0) {
      return { created: 0, skipped: 0 };
    }

    let created = 0;
    let skipped = 0;

    for (const sample of samples) {
      try {
        if (!sample.id) {
          console.warn('Seed product sin ID, generando uno nuevo');
        }

        const docId = sample.id || undefined;
        const docRef = docId ? productsCollection.doc(docId) : null;
        let exists = false;

        if (docRef) {
          const existingDoc = await docRef.get();
          exists = existingDoc.exists;
        } else if (sample.slug) {
          const slugSnapshot = await productsCollection.where('slug', '==', sample.slug).limit(1).get();
          exists = !slugSnapshot.empty;
        }

        if (exists) {
          skipped += 1;
          continue;
        }

        await Product.create(sample);
        created += 1;
      } catch (error) {
        console.error('Error al sembrar producto de ejemplo:', error);
        skipped += 1;
      }
    }

    return { created, skipped };
  }
}

module.exports = Product;