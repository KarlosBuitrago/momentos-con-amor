const Customization = require('../models/Customization');

// Obtener todas las personalizaciones
exports.getAllCustomizations = async (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      isActive: req.query.isActive,
      applicableTo: req.query.applicableTo
    };

    const customizations = await Customization.getAll(filters);
    res.json(customizations);
  } catch (error) {
    console.error('Error en getAllCustomizations:', error);
    res.status(500).json({ error: 'Error al obtener personalizaciones' });
  }
};

// Obtener una personalización por ID
exports.getCustomizationById = async (req, res) => {
  try {
    const customization = await Customization.getById(req.params.id);
    
    if (!customization) {
      return res.status(404).json({ error: 'Personalización no encontrada' });
    }
    
    res.json(customization);
  } catch (error) {
    console.error('Error en getCustomizationById:', error);
    res.status(500).json({ error: 'Error al obtener personalización' });
  }
};

// Obtener múltiples personalizaciones por IDs
exports.getCustomizationsByIds = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'Se requiere un array de IDs' });
    }
    
    const customizations = await Customization.getByIds(ids);
    res.json(customizations);
  } catch (error) {
    console.error('Error en getCustomizationsByIds:', error);
    res.status(500).json({ error: 'Error al obtener personalizaciones' });
  }
};

// Buscar personalizaciones
exports.searchCustomizations = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Se requiere un término de búsqueda' });
    }
    
    const customizations = await Customization.search(q);
    res.json(customizations);
  } catch (error) {
    console.error('Error en searchCustomizations:', error);
    res.status(500).json({ error: 'Error al buscar personalizaciones' });
  }
};

// Crear una nueva personalización
exports.createCustomization = async (req, res) => {
  try {
    const customizationData = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price) || 0,
      category: req.body.category,
      applicableTo: req.body.applicableTo || [],
      imageUrl: req.body.imageUrl,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      sortOrder: parseInt(req.body.sortOrder) || 999
    };

    // Validaciones
    if (!customizationData.name) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    if (!customizationData.category) {
      return res.status(400).json({ error: 'La categoría es obligatoria' });
    }

    const newCustomization = await Customization.create(customizationData);
    res.status(201).json(newCustomization);
  } catch (error) {
    console.error('Error en createCustomization:', error);
    res.status(500).json({ error: 'Error al crear personalización' });
  }
};

// Actualizar una personalización
exports.updateCustomization = async (req, res) => {
  try {
    const customizationData = {};
    
    if (req.body.name !== undefined) customizationData.name = req.body.name;
    if (req.body.description !== undefined) customizationData.description = req.body.description;
    if (req.body.price !== undefined) customizationData.price = parseFloat(req.body.price);
    if (req.body.category !== undefined) customizationData.category = req.body.category;
    if (req.body.applicableTo !== undefined) customizationData.applicableTo = req.body.applicableTo;
    if (req.body.imageUrl !== undefined) customizationData.imageUrl = req.body.imageUrl;
    if (req.body.isActive !== undefined) customizationData.isActive = req.body.isActive;
    if (req.body.sortOrder !== undefined) customizationData.sortOrder = parseInt(req.body.sortOrder);

    const updatedCustomization = await Customization.update(req.params.id, customizationData);
    res.json(updatedCustomization);
  } catch (error) {
    console.error('Error en updateCustomization:', error);
    res.status(500).json({ error: 'Error al actualizar personalización' });
  }
};

// Eliminar una personalización
exports.deleteCustomization = async (req, res) => {
  try {
    await Customization.delete(req.params.id);
    res.json({ message: 'Personalización eliminada correctamente' });
  } catch (error) {
    console.error('Error en deleteCustomization:', error);
    res.status(500).json({ error: 'Error al eliminar personalización' });
  }
};
