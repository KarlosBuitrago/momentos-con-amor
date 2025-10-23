const Product = require('../models/Product');

const parseArrayField = (value, { allowJSON = true } = {}) => {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    if (allowJSON) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (error) {
        // Not JSON, fallback to comma separated parsing
      }
    }
    return value
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }
  return [];
};

const normalizeNumber = (value, defaultValue = 0) => {
  if (value === undefined || value === null || value === '') return defaultValue;
  const num = Number(value);
  return Number.isNaN(num) ? defaultValue : num;
};

const toBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
  }
  return defaultValue;
};

const normalizeCustomizations = (value) => {
  const entries = parseArrayField(value);
  return entries.map((item, index) => {
    if (typeof item === 'string') {
      return {
        id: `custom-${index + 1}`,
        name: item,
        label: item,
        price: 0,
        defaultSelected: false
      };
    }

    return {
      id: item.id || item.key || `custom-${index + 1}`,
      name: item.name || item.label || `Opción ${index + 1}`,
      label: item.label || item.name || `Opción ${index + 1}`,
      price: normalizeNumber(item.price, 0),
      defaultSelected: toBoolean(item.defaultSelected, false),
      description: item.description || ''
    };
  });
};

const createSlug = (name = '') =>
  name
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

// Obtener todos los productos con filtros opcionales
exports.getAllProducts = async (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      targetAudience: req.query.targetAudience,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      isAvailable: req.query.isAvailable
    };
    
    const products = await Product.getAll(filters);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error en getAllProducts:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Obtener un producto por ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error en getProductById:', error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

// Crear un nuevo producto
exports.createProduct = async (req, res) => {
  try {
    if (!req.body.name || !req.body.description) {
      return res.status(400).json({ error: 'Nombre y descripción son requeridos' });
    }

    const sizes = parseArrayField(req.body.sizes);
    const colors = parseArrayField(req.body.colors);
    const materials = parseArrayField(req.body.materials);
    const accessories = parseArrayField(req.body.accessories);
    const includedMaterials = parseArrayField(req.body.includedMaterials || req.body.kitIncludes);
    const imageGallery = parseArrayField(req.body.imageGallery);
    const tags = parseArrayField(req.body.tags);
    const customizations = normalizeCustomizations(req.body.customizations);

    const normalizedCategory = req.body.category || 'Muñecos';
    const inferredType = normalizedCategory && normalizedCategory.toLowerCase().includes('material') ? 'material' : 'doll';
    const productType = req.body.productType || inferredType;
    const isKit = toBoolean(req.body.isKit, false);
    const dollGender = req.body.dollGender || req.body.targetAudience;

    const productData = {
      id: req.body.id,
      name: req.body.name,
      slug: req.body.slug || createSlug(req.body.name),
      description: req.body.description,
      price: normalizeNumber(req.body.price, 0),
      category: normalizedCategory,
      targetAudience: req.body.targetAudience || dollGender || 'Personalizable',
      imageUrl: req.body.imageUrl || imageGallery[0] || '',
      imageGallery,
      stock: normalizeNumber(req.body.stock, 0),
      sizes,
      colors,
      materials,
      accessories,
      tags,
      customizations,
      includedMaterials,
      dollGender,
      productType,
      isKit,
      isCourse: toBoolean(req.body.isCourse, false),
      isAvailable: toBoolean(req.body.isAvailable, true),
      allowPersonalization: toBoolean(req.body.allowPersonalization, true),
      productionTimeDays: normalizeNumber(req.body.productionTimeDays, 7)
    };
    
    const newProduct = await Product.create(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error en createProduct:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

// Actualizar un producto existente
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.getById(productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    const productData = {};
    if (req.body.name) {
      productData.name = req.body.name;
      productData.slug = req.body.slug || createSlug(req.body.name);
    }
    if (req.body.description !== undefined) productData.description = req.body.description;
    if (req.body.price !== undefined) productData.price = normalizeNumber(req.body.price, product.price || 0);
    if (req.body.category) productData.category = req.body.category;
    if (req.body.targetAudience) productData.targetAudience = req.body.targetAudience;
    if (req.body.imageUrl) productData.imageUrl = req.body.imageUrl;
    if (req.body.imageGallery) productData.imageGallery = parseArrayField(req.body.imageGallery);
    if (req.body.stock !== undefined) productData.stock = normalizeNumber(req.body.stock, product.stock || 0);
    if (req.body.sizes) productData.sizes = parseArrayField(req.body.sizes);
    if (req.body.colors) productData.colors = parseArrayField(req.body.colors);
    if (req.body.materials) productData.materials = parseArrayField(req.body.materials);
    if (req.body.accessories) productData.accessories = parseArrayField(req.body.accessories);
    if (req.body.includedMaterials || req.body.kitIncludes) {
      productData.includedMaterials = parseArrayField(req.body.includedMaterials || req.body.kitIncludes);
    }
    if (req.body.tags) productData.tags = parseArrayField(req.body.tags);
    if (req.body.customizations) productData.customizations = normalizeCustomizations(req.body.customizations);
    if (req.body.dollGender !== undefined) productData.dollGender = req.body.dollGender;
    if (req.body.productType) productData.productType = req.body.productType;
    if (req.body.isKit !== undefined) {
      productData.isKit = toBoolean(req.body.isKit, product.isKit ?? false);
    }
    if (req.body.isCourse !== undefined) productData.isCourse = toBoolean(req.body.isCourse, product.isCourse || false);
    if (req.body.isAvailable !== undefined) productData.isAvailable = toBoolean(req.body.isAvailable, product.isAvailable ?? true);
    if (req.body.allowPersonalization !== undefined) {
      productData.allowPersonalization = toBoolean(req.body.allowPersonalization, product.allowPersonalization ?? true);
    }
    if (req.body.productionTimeDays !== undefined) {
      productData.productionTimeDays = normalizeNumber(req.body.productionTimeDays, product.productionTimeDays || 7);
    }
    
    const updatedProduct = await Product.update(productId, productData);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error en updateProduct:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.getById(productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    await Product.delete(productId);
    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error en deleteProduct:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

exports.seedProducts = async (_req, res) => {
  try {
    const samples = [
      {
        id: 'mu-001',
        name: 'Conejito Primavera',
        slug: 'conejito-primavera',
        description: 'Muñeco de crochet tejido a mano con orejas largas y detalles florales. Perfecto para regalos especiales.',
        price: 58000,
        category: 'Muñecos',
        targetAudience: 'Personalizable',
        dollGender: 'Personalizable',
        imageUrl: 'assets/images/imagen 1.jpg',
        imageGallery: ['assets/images/imagen 1.jpg', 'assets/images/imagen 2.jpg'],
        stock: 5,
        materials: ['Hilo algodón premium', 'Relleno hipoalergénico', 'Detalles bordados'],
        tags: ['conejo', 'primavera', 'personalizable'],
        customizations: [
          { id: 'bow', label: 'Moño en el cuello', price: 4000, defaultSelected: true },
          { id: 'flower-crown', label: 'Corona de flores', price: 6000, defaultSelected: false },
          { id: 'gift-wrap', label: 'Caja de regalo especial', price: 8000, defaultSelected: false }
        ],
        includedMaterials: [],
        productType: 'doll',
        isKit: false,
        allowPersonalization: true,
        isAvailable: true,
        productionTimeDays: 5
      },
      {
        id: 'mu-002',
        name: 'Osito Aventurero',
        slug: 'osito-aventurero',
        description: 'Osito de crochet con chaleco desmontable y gorro tejidos. Ideal para decoración o compañía.',
        price: 62000,
        category: 'Muñecos',
        targetAudience: 'Unisex',
        dollGender: 'Unisex',
        imageUrl: 'assets/images/imagen 3.jpg',
        imageGallery: ['assets/images/imagen 3.jpg', 'assets/images/imagen 4.jpg'],
        stock: 3,
        materials: ['Hilo acrílico suave', 'Relleno siliconado', 'Botones decorativos'],
        tags: ['oso', 'aventura', 'chaleco'],
        customizations: [
          { id: 'scarf', label: 'Bufanda adicional', price: 5000, defaultSelected: false },
          { id: 'backpack', label: 'Mochila miniatura', price: 7000, defaultSelected: false },
          { id: 'engraved-tag', label: 'Placa con nombre', price: 4500, defaultSelected: false }
        ],
        includedMaterials: [],
        productType: 'doll',
        isKit: false,
        allowPersonalization: true,
        isAvailable: true,
        productionTimeDays: 7
      },
      {
        id: 'mu-003',
        name: 'Unicornio de Sueños',
        slug: 'unicornio-de-suenos',
        description: 'Unicornio tejido con crin multicolor y detalles brillantes. Incluye base estable y bolsa protectora.',
        price: 68000,
        category: 'Muñecos',
        targetAudience: 'Niñas',
        dollGender: 'Niñas',
        imageUrl: 'assets/images/imagen 5.jpg',
        imageGallery: ['assets/images/imagen 5.jpg', 'assets/images/imagen 6.jpg', 'assets/images/imagen 7.jpg'],
        stock: 4,
        materials: ['Hilo hipoalergénico', 'Relleno premium', 'Hilo metalizado'],
        tags: ['unicornio', 'fantasía', 'luces'],
        customizations: [
          { id: 'led-lights', label: 'Luces led interiores', price: 9000, defaultSelected: false },
          { id: 'name-embroidery', label: 'Nombre bordado', price: 6500, defaultSelected: false },
          { id: 'deluxe-wrap', label: 'Empaque deluxe', price: 7500, defaultSelected: false }
        ],
        includedMaterials: ['Bolsa protectora', 'Base estable'],
        productType: 'doll',
        isKit: false,
        allowPersonalization: true,
        isAvailable: true,
        productionTimeDays: 10
      }
    ];

    const result = await Product.seed(samples);
    res.status(201).json({
      message: 'Productos de ejemplo registrados',
      ...result
    });
  } catch (error) {
    console.error('Error al sembrar productos de ejemplo:', error);
    res.status(500).json({ error: 'Error al sembrar productos de ejemplo' });
  }
};