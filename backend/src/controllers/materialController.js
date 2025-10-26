const Material = require('../models/Material');

// Obtener todos los materiales
exports.getAllMaterials = async (req, res) => {
  try {
    const filters = {
      type: req.query.type,
      isActive: req.query.isActive
    };

    const materials = await Material.getAll(filters);
    res.json(materials);
  } catch (error) {
    console.error('Error en getAllMaterials:', error);
    res.status(500).json({ error: 'Error al obtener materiales' });
  }
};

// Obtener un material por ID
exports.getMaterialById = async (req, res) => {
  try {
    const material = await Material.getById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }
    
    res.json(material);
  } catch (error) {
    console.error('Error en getMaterialById:', error);
    res.status(500).json({ error: 'Error al obtener material' });
  }
};

// Obtener múltiples materiales por IDs
exports.getMaterialsByIds = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'Se requiere un array de IDs' });
    }
    
    const materials = await Material.getByIds(ids);
    res.json(materials);
  } catch (error) {
    console.error('Error en getMaterialsByIds:', error);
    res.status(500).json({ error: 'Error al obtener materiales' });
  }
};

// Buscar materiales
exports.searchMaterials = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Se requiere un término de búsqueda' });
    }
    
    const materials = await Material.search(q);
    res.json(materials);
  } catch (error) {
    console.error('Error en searchMaterials:', error);
    res.status(500).json({ error: 'Error al buscar materiales' });
  }
};

// Crear un nuevo material
exports.createMaterial = async (req, res) => {
  try {
    const materialData = {
      name: req.body.name,
      description: req.body.description,
      type: req.body.type,
      brand: req.body.brand,
      color: req.body.color,
      size: req.body.size,
      composition: req.body.composition,
      productId: req.body.productId,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    // Validaciones
    if (!materialData.name) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    if (!materialData.type) {
      return res.status(400).json({ error: 'El tipo es obligatorio' });
    }

    const newMaterial = await Material.create(materialData);
    res.status(201).json(newMaterial);
  } catch (error) {
    console.error('Error en createMaterial:', error);
    res.status(500).json({ error: 'Error al crear material' });
  }
};

// Actualizar un material
exports.updateMaterial = async (req, res) => {
  try {
    const materialData = {};
    
    if (req.body.name !== undefined) materialData.name = req.body.name;
    if (req.body.description !== undefined) materialData.description = req.body.description;
    if (req.body.type !== undefined) materialData.type = req.body.type;
    if (req.body.brand !== undefined) materialData.brand = req.body.brand;
    if (req.body.color !== undefined) materialData.color = req.body.color;
    if (req.body.size !== undefined) materialData.size = req.body.size;
    if (req.body.composition !== undefined) materialData.composition = req.body.composition;
    if (req.body.productId !== undefined) materialData.productId = req.body.productId;
    if (req.body.isActive !== undefined) materialData.isActive = req.body.isActive;

    const updatedMaterial = await Material.update(req.params.id, materialData);
    res.json(updatedMaterial);
  } catch (error) {
    console.error('Error en updateMaterial:', error);
    res.status(500).json({ error: 'Error al actualizar material' });
  }
};

// Eliminar un material
exports.deleteMaterial = async (req, res) => {
  try {
    await Material.delete(req.params.id);
    res.json({ message: 'Material eliminado correctamente' });
  } catch (error) {
    console.error('Error en deleteMaterial:', error);
    res.status(500).json({ error: 'Error al eliminar material' });
  }
};
