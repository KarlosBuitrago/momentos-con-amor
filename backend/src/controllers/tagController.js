const Tag = require('../models/Tag');

// Obtener todos los tags
exports.getAllTags = async (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      isActive: req.query.isActive,
      sortBy: req.query.sortBy
    };

    const tags = await Tag.getAll(filters);
    res.json(tags);
  } catch (error) {
    console.error('Error en getAllTags:', error);
    res.status(500).json({ error: 'Error al obtener tags' });
  }
};

// Obtener un tag por ID
exports.getTagById = async (req, res) => {
  try {
    const tag = await Tag.getById(req.params.id);
    
    if (!tag) {
      return res.status(404).json({ error: 'Tag no encontrado' });
    }
    
    res.json(tag);
  } catch (error) {
    console.error('Error en getTagById:', error);
    res.status(500).json({ error: 'Error al obtener tag' });
  }
};

// Obtener múltiples tags por IDs
exports.getTagsByIds = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'Se requiere un array de IDs' });
    }
    
    const tags = await Tag.getByIds(ids);
    res.json(tags);
  } catch (error) {
    console.error('Error en getTagsByIds:', error);
    res.status(500).json({ error: 'Error al obtener tags' });
  }
};

// Buscar tags
exports.searchTags = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Se requiere un término de búsqueda' });
    }
    
    const tags = await Tag.search(q);
    res.json(tags);
  } catch (error) {
    console.error('Error en searchTags:', error);
    res.status(500).json({ error: 'Error al buscar tags' });
  }
};

// Crear un nuevo tag
exports.createTag = async (req, res) => {
  try {
    const tagData = {
      name: req.body.name,
      slug: req.body.slug,
      category: req.body.category,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      usageCount: 0
    };

    // Validaciones
    if (!tagData.name) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    const newTag = await Tag.create(tagData);
    res.status(201).json(newTag);
  } catch (error) {
    console.error('Error en createTag:', error);
    res.status(500).json({ error: 'Error al crear tag' });
  }
};

// Actualizar un tag
exports.updateTag = async (req, res) => {
  try {
    const tagData = {};
    
    if (req.body.name !== undefined) tagData.name = req.body.name;
    if (req.body.slug !== undefined) tagData.slug = req.body.slug;
    if (req.body.category !== undefined) tagData.category = req.body.category;
    if (req.body.isActive !== undefined) tagData.isActive = req.body.isActive;
    if (req.body.usageCount !== undefined) tagData.usageCount = parseInt(req.body.usageCount);

    const updatedTag = await Tag.update(req.params.id, tagData);
    res.json(updatedTag);
  } catch (error) {
    console.error('Error en updateTag:', error);
    res.status(500).json({ error: 'Error al actualizar tag' });
  }
};

// Eliminar un tag
exports.deleteTag = async (req, res) => {
  try {
    await Tag.delete(req.params.id);
    res.json({ message: 'Tag eliminado correctamente' });
  } catch (error) {
    console.error('Error en deleteTag:', error);
    res.status(500).json({ error: 'Error al eliminar tag' });
  }
};
