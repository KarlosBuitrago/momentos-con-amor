const { db } = require('../config/firebase');

async function seedData() {
  console.log('🌱 Iniciando población de datos...\n');

  try {
    // 1. PERSONALIZACIONES
    console.log('📦 Creando personalizaciones...');
    const customizations = [
      {
        id: 'custom-001',
        name: 'Moño en el cuello',
        description: 'Moño decorativo de tela suave',
        price: 4000,
        category: 'accessory',
        applicableTo: ['doll', 'kit'],
        isActive: true,
        sortOrder: 1
      },
      {
        id: 'custom-002',
        name: 'Corona de flores',
        description: 'Corona tejida con flores pequeñas',
        price: 6000,
        category: 'accessory',
        applicableTo: ['doll'],
        isActive: true,
        sortOrder: 2
      },
      {
        id: 'custom-003',
        name: 'Caja de regalo básica',
        description: 'Caja decorativa para regalo',
        price: 8000,
        category: 'packaging',
        applicableTo: ['doll', 'kit'],
        isActive: true,
        sortOrder: 3
      },
      {
        id: 'custom-004',
        name: 'Nombre bordado',
        description: 'Bordado personalizado con nombre',
        price: 6500,
        category: 'embroidery',
        applicableTo: ['doll'],
        isActive: true,
        sortOrder: 4
      },
      {
        id: 'custom-005',
        name: 'Bufanda adicional',
        description: 'Bufanda tejida a juego',
        price: 5000,
        category: 'accessory',
        applicableTo: ['doll'],
        isActive: true,
        sortOrder: 5
      }
    ];

    let customCreated = 0;
    for (const custom of customizations) {
      const docRef = db.collection('customizations').doc(custom.id);
      const doc = await docRef.get();
      if (!doc.exists) {
        await docRef.set({
          ...custom,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`  ✓ ${custom.name}`);
        customCreated++;
      }
    }
    console.log(`  Total: ${customCreated} personalizaciones creadas\n`);

    // 2. MATERIALES
    console.log('🧶 Creando materiales...');
    const materials = [
      {
        id: 'mat-001',
        name: 'Hilo acrílico rojo',
        description: 'Hilo acrílico de alta calidad',
        type: 'thread',
        brand: 'Anchor',
        color: 'Rojo',
        size: '100g',
        composition: '100% Acrílico',
        isActive: true
      },
      {
        id: 'mat-002',
        name: 'Hilo acrílico azul',
        description: 'Hilo acrílico de alta calidad',
        type: 'thread',
        brand: 'Anchor',
        color: 'Azul',
        size: '100g',
        composition: '100% Acrílico',
        isActive: true
      },
      {
        id: 'mat-003',
        name: 'Relleno hipoalergénico',
        description: 'Relleno de fibra siliconada',
        type: 'filling',
        brand: 'Premium',
        size: '500g',
        composition: '100% Poliéster',
        isActive: true
      },
      {
        id: 'mat-004',
        name: 'Ojos de seguridad 12mm',
        description: 'Ojos de seguridad para amigurumis',
        type: 'accessory',
        brand: 'Generic',
        color: 'Negro',
        size: '12mm',
        isActive: true
      },
      {
        id: 'mat-005',
        name: 'Aguja de crochet 3.5mm',
        description: 'Aguja de aluminio',
        type: 'needle',
        brand: 'Clover',
        size: '3.5mm',
        isActive: true
      },
      {
        id: 'mat-006',
        name: 'Hilo algodón blanco',
        description: 'Hilo de algodón premium',
        type: 'thread',
        brand: 'DMC',
        color: 'Blanco',
        size: '50g',
        composition: '100% Algodón',
        isActive: true
      }
    ];

    let matCreated = 0;
    for (const material of materials) {
      const docRef = db.collection('materials').doc(material.id);
      const doc = await docRef.get();
      if (!doc.exists) {
        await docRef.set({
          ...material,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`  ✓ ${material.name}`);
        matCreated++;
      }
    }
    console.log(`  Total: ${matCreated} materiales creados\n`);

    // 3. TAGS
    console.log('🏷️  Creando tags...');
    const tags = [
      {
        id: 'tag-001',
        name: 'primavera',
        slug: 'primavera',
        category: 'ocasión',
        usageCount: 0,
        isActive: true
      },
      {
        id: 'tag-002',
        name: 'regalo',
        slug: 'regalo',
        category: 'uso',
        usageCount: 0,
        isActive: true
      },
      {
        id: 'tag-003',
        name: 'personalizable',
        slug: 'personalizable',
        category: 'característica',
        usageCount: 0,
        isActive: true
      },
      {
        id: 'tag-004',
        name: 'niños',
        slug: 'ninos',
        category: 'público',
        usageCount: 0,
        isActive: true
      },
      {
        id: 'tag-005',
        name: 'decoración',
        slug: 'decoracion',
        category: 'uso',
        usageCount: 0,
        isActive: true
      },
      {
        id: 'tag-006',
        name: 'navidad',
        slug: 'navidad',
        category: 'ocasión',
        usageCount: 0,
        isActive: true
      },
      {
        id: 'tag-007',
        name: 'cumpleaños',
        slug: 'cumpleanos',
        category: 'ocasión',
        usageCount: 0,
        isActive: true
      },
      {
        id: 'tag-008',
        name: 'bebé',
        slug: 'bebe',
        category: 'público',
        usageCount: 0,
        isActive: true
      }
    ];

    let tagCreated = 0;
    for (const tag of tags) {
      const docRef = db.collection('tags').doc(tag.id);
      const doc = await docRef.get();
      if (!doc.exists) {
        await docRef.set({
          ...tag,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`  ✓ ${tag.name}`);
        tagCreated++;
      }
    }
    console.log(`  Total: ${tagCreated} tags creados\n`);

    // RESUMEN
    console.log('═══════════════════════════════════');
    console.log('✅ Población completada exitosamente');
    console.log('═══════════════════════════════════');
    console.log(`Personalizaciones: ${customCreated} creadas`);
    console.log(`Materiales: ${matCreated} creados`);
    console.log(`Tags: ${tagCreated} creados`);
    console.log('═══════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error durante la población:', error);
    throw error;
  }
}

if (require.main === module) {
  seedData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = seedData;
