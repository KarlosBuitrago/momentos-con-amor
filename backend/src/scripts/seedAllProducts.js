/**
 * Script para poblar la base de datos con productos de ejemplo
 * Incluye muñecos, materiales y cursos
 */

const admin = require('firebase-admin');
const path = require('path');

// Inicializar Firebase Admin
const serviceAccountPath = path.join(__dirname, '../../react-firebase-dbc76-firebase-adminsdk-z2n37-911e39435e.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const sampleProducts = [
  // Muñecos
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
    productionTimeDays: 5,
    isCourse: false
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
    productionTimeDays: 7,
    isCourse: false
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
    productionTimeDays: 10,
    isCourse: false
  },
  // Materiales
  {
    id: 'mat-001',
    name: 'Hilo Acrílico Premium - Set 10 colores',
    slug: 'hilo-acrilico-premium-set',
    description: 'Set de 10 ovillos de hilo acrílico de alta calidad en colores variados. Ideal para proyectos de crochet y tejido.',
    price: 35000,
    category: 'Materiales',
    targetAudience: 'Todos',
    imageUrl: 'assets/images/default-material.svg',
    imageGallery: ['assets/images/default-material.svg'],
    stock: 20,
    materials: ['100% Acrílico'],
    tags: ['hilo', 'acrílico', 'colores', 'set'],
    customizations: [],
    includedMaterials: [],
    productType: 'material',
    isKit: false,
    isCourse: false,
    allowPersonalization: false,
    isAvailable: true,
    productionTimeDays: 0
  },
  {
    id: 'mat-002',
    name: 'Agujas de Crochet - Set Completo',
    slug: 'agujas-crochet-set-completo',
    description: 'Set de 12 agujas de crochet en diferentes tamaños (2mm a 10mm). Incluye estuche organizador.',
    price: 28000,
    category: 'Materiales',
    targetAudience: 'Todos',
    imageUrl: 'assets/images/default-material.svg',
    imageGallery: ['assets/images/default-material.svg'],
    stock: 15,
    materials: ['Aluminio anodizado', 'Estuche de tela'],
    tags: ['agujas', 'crochet', 'herramientas', 'set'],
    customizations: [],
    includedMaterials: ['Estuche organizador'],
    productType: 'material',
    isKit: false,
    isCourse: false,
    allowPersonalization: false,
    isAvailable: true,
    productionTimeDays: 0
  },
  {
    id: 'mat-003',
    name: 'Relleno Hipoalergénico Premium - 500g',
    slug: 'relleno-hipoalergenico-premium',
    description: 'Relleno de fibra siliconada hipoalergénica de alta calidad. Suave, lavable y duradero.',
    price: 18000,
    category: 'Materiales',
    targetAudience: 'Todos',
    imageUrl: 'assets/images/default-material.svg',
    imageGallery: ['assets/images/default-material.svg'],
    stock: 25,
    materials: ['Fibra siliconada 100% poliéster'],
    tags: ['relleno', 'hipoalergénico', 'fibra'],
    customizations: [],
    includedMaterials: [],
    productType: 'material',
    isKit: false,
    isCourse: false,
    allowPersonalization: false,
    isAvailable: true,
    productionTimeDays: 0
  },
  {
    id: 'mat-004',
    name: 'Kit Completo para Principiantes',
    slug: 'kit-completo-principiantes',
    description: 'Kit completo con todo lo necesario para empezar en el mundo del crochet. Incluye hilos, agujas, relleno y patrones básicos.',
    price: 65000,
    category: 'Materiales',
    targetAudience: 'Todos',
    imageUrl: 'assets/images/default-material.svg',
    imageGallery: ['assets/images/default-material.svg'],
    stock: 10,
    materials: ['Hilos variados', 'Agujas', 'Relleno', 'Patrones impresos'],
    tags: ['kit', 'principiantes', 'completo', 'inicio'],
    customizations: [],
    includedMaterials: ['5 ovillos de hilo', '3 agujas de crochet', '200g de relleno', 'Libro de patrones básicos'],
    productType: 'material',
    isKit: true,
    isCourse: false,
    allowPersonalization: false,
    isAvailable: true,
    productionTimeDays: 0
  },
  // Cursos
  {
    id: 'cur-001',
    name: 'Curso Básico de Crochet',
    slug: 'curso-basico-crochet',
    description: 'Aprende los fundamentos del crochet desde cero. Incluye 8 clases en video, material descargable y certificado.',
    price: 120000,
    category: 'Cursos',
    targetAudience: 'Todos',
    imageUrl: 'assets/images/default-course.svg',
    imageGallery: ['assets/images/default-course.svg'],
    stock: 999,
    materials: ['Acceso a plataforma online', '8 videos HD', 'Material PDF descargable'],
    tags: ['curso', 'básico', 'online', 'certificado'],
    customizations: [],
    includedMaterials: ['8 clases en video', 'Material descargable', 'Certificado de finalización', 'Soporte por email'],
    productType: 'course',
    isKit: false,
    isCourse: true,
    allowPersonalization: false,
    isAvailable: true,
    difficulty: 'Principiante',
    productionTimeDays: 0
  },
  {
    id: 'cur-002',
    name: 'Curso Avanzado: Amigurumis Realistas',
    slug: 'curso-avanzado-amigurumis',
    description: 'Domina las técnicas avanzadas para crear amigurumis con detalles realistas. 12 clases con proyectos prácticos.',
    price: 180000,
    category: 'Cursos',
    targetAudience: 'Todos',
    imageUrl: 'assets/images/default-course.svg',
    imageGallery: ['assets/images/default-course.svg'],
    stock: 999,
    materials: ['Acceso a plataforma online', '12 videos HD', 'Patrones exclusivos'],
    tags: ['curso', 'avanzado', 'amigurumi', 'realista'],
    customizations: [],
    includedMaterials: ['12 clases en video', '5 patrones exclusivos', 'Certificado de finalización', 'Grupo privado de Facebook'],
    productType: 'course',
    isKit: false,
    isCourse: true,
    allowPersonalization: false,
    isAvailable: true,
    difficulty: 'Avanzado',
    productionTimeDays: 0
  },
  {
    id: 'cur-003',
    name: 'Taller: Crea tu Primer Muñeco',
    slug: 'taller-primer-muneco',
    description: 'Taller práctico de 4 semanas donde crearás tu primer muñeco de crochet paso a paso. Incluye kit de materiales.',
    price: 150000,
    category: 'Cursos',
    targetAudience: 'Todos',
    imageUrl: 'assets/images/default-course.svg',
    imageGallery: ['assets/images/default-course.svg'],
    stock: 999,
    materials: ['Kit de materiales incluido', '4 clases en vivo', 'Grabaciones disponibles'],
    tags: ['taller', 'práctico', 'muñeco', 'en vivo'],
    customizations: [],
    includedMaterials: ['Kit de materiales completo', '4 clases en vivo por Zoom', 'Grabaciones de las clases', 'Soporte personalizado'],
    productType: 'course',
    isKit: false,
    isCourse: true,
    allowPersonalization: false,
    isAvailable: true,
    difficulty: 'Intermedio',
    productionTimeDays: 0
  }
];

async function seedProducts() {
  console.log('Iniciando población de productos...');
  
  let created = 0;
  let skipped = 0;
  
  for (const product of sampleProducts) {
    try {
      const docRef = db.collection('products').doc(product.id);
      const doc = await docRef.get();
      
      if (doc.exists) {
        console.log(`Producto ${product.id} ya existe, omitiendo...`);
        skipped++;
        continue;
      }
      
      await docRef.set({
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log(`✓ Producto creado: ${product.name} (${product.category})`);
      created++;
    } catch (error) {
      console.error(`Error al crear producto ${product.id}:`, error);
      skipped++;
    }
  }
  
  console.log('\n=== Resumen ===');
  console.log(`Productos creados: ${created}`);
  console.log(`Productos omitidos: ${skipped}`);
  console.log(`Total procesados: ${created + skipped}`);
  
  process.exit(0);
}

seedProducts().catch(error => {
  console.error('Error en el proceso de población:', error);
  process.exit(1);
});
