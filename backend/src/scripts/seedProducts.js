const admin = require('firebase-admin');
const path = require('path');

// Inicializar Firebase Admin si no está inicializado
if (!admin.apps.length) {
  const serviceAccountPath = path.join(__dirname, '../../react-firebase-dbc76-firebase-adminsdk-z2n37-911e39435e.json');
  const serviceAccount = require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// Productos de prueba
const products = [
  // MUÑECOS
  {
    id: 'doll-001',
    name: 'Unicornio Mágico',
    description: 'Hermoso unicornio tejido a mano con hilo acrílico suave. Incluye crin multicolor brillante, cuerno dorado y detalles bordados. Perfecto para decoración o regalo.',
    price: 68000,
    category: 'Muñecos',
    targetAudience: 'Personalizable',
    dollGender: 'Unisex',
    imageUrl: 'assets/images/unicornio.jpg',
    imageGallery: ['assets/images/unicornio.jpg', 'assets/images/unicornio-2.jpg'],
    stock: 5,
    materials: ['Hilo acrílico multicolor', 'Relleno hipoalergénico', 'Ojos de seguridad 12mm', 'Hilo dorado para cuerno'],
    tags: ['unicornio', 'fantasía', 'regalo', 'personalizable', 'niños'],
    customizations: [
      { id: 'custom-001', label: 'Moño en el cuello', price: 4000, defaultSelected: false },
      { id: 'custom-002', label: 'Corona de flores', price: 6000, defaultSelected: false }
    ],
    isKit: false,
    productType: 'doll',
    allowPersonalization: true,
    productionTimeDays: 7,
    isAvailable: true,
    isCourse: false
  },
  {
    id: 'doll-002',
    name: 'Osito Teddy Clásico',
    description: 'Tierno osito tejido estilo vintage con lazo al cuello. Suave y abrazable, ideal para bebés y niños pequeños. Hecho con materiales hipoalergénicos.',
    price: 55000,
    category: 'Muñecos',
    targetAudience: 'Unisex',
    dollGender: 'Unisex',
    imageUrl: 'assets/images/osito.jpg',
    imageGallery: ['assets/images/osito.jpg'],
    stock: 8,
    materials: ['Hilo acrílico café', 'Relleno siliconado', 'Ojos bordados', 'Listón de satén'],
    tags: ['osito', 'teddy', 'bebé', 'regalo', 'clásico'],
    customizations: [
      { id: 'custom-004', label: 'Nombre bordado', price: 6500, defaultSelected: false },
      { id: 'custom-003', label: 'Caja de regalo básica', price: 8000, defaultSelected: false }
    ],
    isKit: false,
    productType: 'doll',
    allowPersonalization: true,
    productionTimeDays: 5,
    isAvailable: true,
    isCourse: false
  },
  {
    id: 'doll-003',
    name: 'Kit Conejo Primaveral',
    description: 'Kit completo para tejer tu propio conejo amigurumi. Incluye todos los materiales necesarios, patrón detallado con fotos paso a paso e instrucciones en español.',
    price: 45000,
    category: 'Muñecos',
    targetAudience: 'Mujer',
    dollGender: 'Decorativo',
    imageUrl: 'assets/images/conejo-kit.jpg',
    imageGallery: ['assets/images/conejo-kit.jpg', 'assets/images/conejo-materiales.jpg'],
    stock: 12,
    materials: ['Hilo acrílico blanco y rosa', 'Relleno hipoalergénico', 'Ojos de seguridad', 'Patrón impreso'],
    includedMaterials: [
      'Hilo acrílico blanco (50g)',
      'Hilo acrílico rosa (25g)',
      'Relleno de fibra (100g)',
      'Par de ojos de seguridad 10mm',
      'Aguja de crochet 3.5mm',
      'Aguja lanera',
      'Patrón detallado con fotos',
      'Marcador de vueltas'
    ],
    tags: ['kit', 'conejo', 'primavera', 'diy', 'principiante'],
    customizations: [],
    isKit: true,
    productType: 'doll',
    allowPersonalization: false,
    productionTimeDays: 3,
    isAvailable: true,
    isCourse: false
  },
  {
    id: 'doll-004',
    name: 'Dragón Guardián',
    description: 'Majestuoso dragón tejido con escamas texturizadas y alas desplegables. Pieza de colección única con detalles meticulosos. Perfecto para fanáticos de la fantasía.',
    price: 95000,
    category: 'Muñecos',
    targetAudience: 'Hombre',
    dollGender: 'Coleccionable',
    imageUrl: 'assets/images/dragon.jpg',
    imageGallery: ['assets/images/dragon.jpg', 'assets/images/dragon-detalle.jpg'],
    stock: 3,
    materials: ['Hilo acrílico verde y dorado', 'Alambre para alas', 'Relleno premium', 'Ojos de cristal', 'Fieltro para detalles'],
    tags: ['dragón', 'fantasía', 'colección', 'adultos', 'decoración'],
    customizations: [
      { id: 'custom-005', label: 'Base de exhibición', price: 15000, defaultSelected: false }
    ],
    isKit: false,
    productType: 'doll',
    allowPersonalization: true,
    productionTimeDays: 14,
    isAvailable: true,
    isCourse: false
  },

  // MATERIALES
  {
    id: 'mat-007',
    name: 'Set de Hilos Acrílicos Pastel (10 colores)',
    description: 'Colección de 10 ovillos de hilo acrílico en tonos pastel suaves. Ideal para proyectos de amigurumi, mantas de bebé y accesorios delicados. Cada ovillo de 50g.',
    price: 35000,
    category: 'Materiales',
    imageUrl: 'assets/images/hilos-pastel.jpg',
    imageGallery: ['assets/images/hilos-pastel.jpg', 'assets/images/hilos-pastel-colores.jpg'],
    stock: 15,
    tags: ['hilo', 'acrílico', 'pastel', 'set', 'colores'],
    isKit: false,
    productType: 'material',
    allowPersonalization: false,
    productionTimeDays: 0,
    isAvailable: true,
    isCourse: false
  },
  {
    id: 'mat-008',
    name: 'Relleno Premium Hipoalergénico 1kg',
    description: 'Fibra de relleno de alta calidad, suave y esponjosa. Hipoalergénica y lavable. Perfecta para muñecos, cojines y peluches. Mantiene su forma después del lavado.',
    price: 28000,
    category: 'Materiales',
    imageUrl: 'assets/images/relleno.jpg',
    imageGallery: ['assets/images/relleno.jpg'],
    stock: 20,
    tags: ['relleno', 'fibra', 'hipoalergénico', 'premium', 'lavable'],
    isKit: false,
    productType: 'material',
    allowPersonalization: false,
    productionTimeDays: 0,
    isAvailable: true,
    isCourse: false
  },
  {
    id: 'mat-009',
    name: 'Kit de Agujas de Crochet Ergonómicas (8 piezas)',
    description: 'Set completo de agujas de crochet con mango ergonómico de silicona. Incluye tamaños desde 2.5mm hasta 6mm. Viene en estuche organizador con cierre.',
    price: 42000,
    category: 'Materiales',
    imageUrl: 'assets/images/agujas-set.jpg',
    imageGallery: ['assets/images/agujas-set.jpg', 'assets/images/agujas-estuche.jpg'],
    stock: 10,
    tags: ['agujas', 'crochet', 'ergonómicas', 'set', 'herramientas'],
    isKit: false,
    productType: 'material',
    allowPersonalization: false,
    productionTimeDays: 0,
    isAvailable: true,
    isCourse: false
  },
  {
    id: 'mat-010',
    name: 'Ojos de Seguridad Surtidos (100 pares)',
    description: 'Colección variada de ojos de seguridad para amigurumi. Incluye tamaños 6mm, 8mm, 10mm y 12mm en negro. Con arandelas de seguridad incluidas.',
    price: 25000,
    category: 'Materiales',
    imageUrl: 'assets/images/ojos-seguridad.jpg',
    imageGallery: ['assets/images/ojos-seguridad.jpg'],
    stock: 25,
    tags: ['ojos', 'seguridad', 'amigurumi', 'accesorios', 'surtido'],
    isKit: false,
    productType: 'material',
    allowPersonalization: false,
    productionTimeDays: 0,
    isAvailable: true,
    isCourse: false
  },

  // CURSOS
  {
    id: 'course-001',
    name: 'Curso: Amigurumi para Principiantes',
    description: 'Aprende a tejer amigurumis desde cero. Curso online con 12 lecciones en video, incluye 5 patrones descargables y acceso a grupo privado de Facebook. Certificado al finalizar.',
    price: 89000,
    category: 'Cursos',
    imageUrl: 'assets/images/curso-principiantes.jpg',
    imageGallery: ['assets/images/curso-principiantes.jpg', 'assets/images/curso-contenido.jpg'],
    stock: 999,
    tags: ['curso', 'online', 'principiante', 'amigurumi', 'video'],
    isKit: false,
    productType: 'material',
    allowPersonalization: false,
    productionTimeDays: 0,
    isAvailable: true,
    isCourse: true
  },
  {
    id: 'course-002',
    name: 'Curso: Técnicas Avanzadas de Texturizado',
    description: 'Domina técnicas profesionales de texturizado y acabados. 8 lecciones avanzadas con proyectos prácticos. Incluye patrones exclusivos y asesoría personalizada por 30 días.',
    price: 125000,
    category: 'Cursos',
    imageUrl: 'assets/images/curso-avanzado.jpg',
    imageGallery: ['assets/images/curso-avanzado.jpg'],
    stock: 999,
    tags: ['curso', 'avanzado', 'técnicas', 'texturizado', 'profesional'],
    isKit: false,
    productType: 'material',
    allowPersonalization: false,
    productionTimeDays: 0,
    isAvailable: true,
    isCourse: true
  },
  {
    id: 'course-003',
    name: 'Taller Presencial: Muñecos Navideños',
    description: 'Taller presencial de 4 horas en Bogotá. Aprende a tejer Santa Claus, reno y muñeco de nieve. Incluye todos los materiales, refrigerio y patrón impreso para llevar.',
    price: 75000,
    category: 'Cursos',
    imageUrl: 'assets/images/taller-navidad.jpg',
    imageGallery: ['assets/images/taller-navidad.jpg', 'assets/images/taller-ambiente.jpg'],
    stock: 15,
    tags: ['taller', 'presencial', 'navidad', 'bogotá', 'grupal'],
    isKit: false,
    productType: 'material',
    allowPersonalization: false,
    productionTimeDays: 0,
    isAvailable: true,
    isCourse: true
  },
  {
    id: 'course-004',
    name: 'Curso: Diseño de Patrones Propios',
    description: 'Aprende a crear tus propios diseños de amigurumi. Curso completo de 15 lecciones sobre anatomía, proporciones, cálculos y documentación de patrones. Incluye software de diseño.',
    price: 150000,
    category: 'Cursos',
    imageUrl: 'assets/images/curso-diseno.jpg',
    imageGallery: ['assets/images/curso-diseno.jpg'],
    stock: 999,
    tags: ['curso', 'diseño', 'patrones', 'creativo', 'profesional'],
    isKit: false,
    productType: 'material',
    allowPersonalization: false,
    productionTimeDays: 0,
    isAvailable: true,
    isCourse: true
  }
];

async function seedProducts() {
  console.log('🌱 Iniciando población de productos de prueba...\n');

  try {
    const productsRef = db.collection('products');
    let created = 0;
    let updated = 0;

    for (const product of products) {
      const docRef = productsRef.doc(product.id);
      const doc = await docRef.get();

      const productData = {
        ...product,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      if (doc.exists) {
        await docRef.update({
          ...productData,
          createdAt: doc.data().createdAt // Mantener fecha de creación original
        });
        updated++;
        console.log(`✅ Actualizado: ${product.name} (${product.category})`);
      } else {
        await docRef.set(productData);
        created++;
        console.log(`✨ Creado: ${product.name} (${product.category})`);
      }
    }

    console.log('\n═══════════════════════════════════');
    console.log('✅ Población completada exitosamente');
    console.log('═══════════════════════════════════');
    console.log(`Productos creados: ${created}`);
    console.log(`Productos actualizados: ${updated}`);
    console.log(`Total procesados: ${products.length}`);
    console.log('\n📊 Resumen por categoría:');
    
    const byCategory = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(byCategory).forEach(([category, count]) => {
      console.log(`  - ${category}: ${count} productos`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error poblando productos:', error);
    process.exit(1);
  }
}

// Ejecutar el script
seedProducts();
