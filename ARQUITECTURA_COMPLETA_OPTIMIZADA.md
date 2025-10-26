# Arquitectura Completa Optimizada - Sistema de E-commerce

## 🎯 Principios de Diseño

1. **Sin Duplicación:** Tablas separadas para datos reutilizables
2. **Campos Condicionales:** Solo campos relevantes según el tipo de producto
3. **Selectores Inteligentes:** Crear nuevo o seleccionar existente
4. **Normalización:** Relaciones claras entre entidades

## 📊 Estructura de Colecciones

### 1. Colección: `products` (Base)

```typescript
interface Product {
  // Campos comunes a TODOS los productos
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  imageGallery: string[];
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Tipo de producto (determina qué campos adicionales aplican)
  productType: 'doll' | 'material' | 'course' | 'kit';
  category: string; // "Muñecos", "Materiales", "Cursos"
  
  // Relaciones (IDs a otras colecciones)
  tagIds: string[];                    // Tags aplicables a TODOS
  
  // Campos específicos por tipo (opcionales)
  dollData?: DollData;                 // Solo si productType === 'doll'
  materialData?: MaterialData;         // Solo si productType === 'material'
  courseData?: CourseData;             // Solo si productType === 'course'
  kitData?: KitData;                   // Solo si productType === 'kit'
}
```

### 2. Datos Específicos por Tipo

#### A. DollData (Solo Muñecos)
```typescript
interface DollData {
  targetAudience: string;              // "Niños", "Niñas", "Unisex", "Personalizable"
  dollGender: string;                  // Género del muñeco
  difficulty: string;                  // "Principiante", "Intermedio", "Avanzado"
  productionTimeDays: number;          // Días de producción
  allowPersonalization: boolean;       // ¿Permite personalización?
  
  // Relaciones
  materialIds: string[];               // IDs de materiales usados
  customizationIds: string[];          // IDs de personalizaciones disponibles
  defaultCustomizationIds: string[];   // Personalizaciones por defecto
}
```

#### B. MaterialData (Solo Materiales)
```typescript
interface MaterialData {
  materialType: string;                // "Hilo", "Aguja", "Relleno", "Accesorio"
  brand?: string;                      // Marca del material
  color?: string;                      // Color (si aplica)
  size?: string;                       // Tamaño/grosor (ej: "3.5mm")
  quantity?: string;                   // Cantidad (ej: "100g", "Set de 12")
  composition?: string;                // Composición (ej: "100% Acrílico")
  
  // NO necesita:
  // - targetAudience (no aplica)
  // - materials (es el material mismo)
  // - customizations (generalmente no)
}
```

#### C. CourseData (Solo Cursos)
```typescript
interface CourseData {
  difficulty: string;                  // "Principiante", "Intermedio", "Avanzado"
  duration: string;                    // "4 semanas", "8 clases"
  format: string;                      // "Online", "Presencial", "Híbrido"
  instructor?: string;                 // Nombre del instructor
  
  // Relaciones
  includedMaterialIds: string[];       // Materiales incluidos en el curso
  
  // NO necesita:
  // - targetAudience (todos pueden tomar cursos)
  // - materials (usa includedMaterialIds)
  // - customizations (no aplica)
}
```

#### D. KitData (Solo Kits)
```typescript
interface KitData {
  kitType: string;                     // "Principiante", "Avanzado", "Temático"
  targetAudience?: string;             // Opcional, si el kit es para niños/adultos
  
  // Relaciones
  includedMaterialIds: string[];       // Materiales incluidos en el kit
  optionalMaterialIds: string[];       // Materiales opcionales que se pueden agregar
  customizationIds: string[];          // Personalizaciones del kit
  
  // Configuración
  allowMaterialSelection: boolean;     // ¿Permite elegir materiales?
}
```

### 3. Colección: `customizations`

```typescript
interface Customization {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'accessory' | 'packaging' | 'embroidery' | 'color' | 'material';
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  
  // Aplicabilidad
  applicableTo: ('doll' | 'kit')[];    // Solo muñecos y kits tienen personalizaciones
  
  createdAt: Date;
  updatedAt: Date;
}
```

**Ejemplos:**
```json
{
  "id": "custom-001",
  "name": "Moño en el cuello",
  "description": "Moño decorativo de tela suave",
  "price": 4000,
  "category": "accessory",
  "applicableTo": ["doll", "kit"],
  "isActive": true,
  "sortOrder": 1
}
```

### 4. Colección: `materials`

```typescript
interface Material {
  id: string;
  name: string;
  description: string;
  type: 'thread' | 'needle' | 'filling' | 'accessory' | 'tool';
  brand?: string;
  color?: string;
  size?: string;
  
  // Referencia al producto (si se vende)
  productId?: string;                  // ID del producto en la colección products
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Ejemplos:**
```json
{
  "id": "mat-001",
  "name": "Hilo acrílico rojo",
  "description": "Hilo acrílico de alta calidad",
  "type": "thread",
  "brand": "Anchor",
  "color": "Rojo",
  "productId": "prod-mat-001"
}
```

### 5. Colección: `tags`

```typescript
interface Tag {
  id: string;
  name: string;
  slug: string;
  category?: string;                   // "color", "ocasión", "estilo", etc.
  usageCount: number;                  // Cuántos productos lo usan
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Ejemplos:**
```json
{
  "id": "tag-001",
  "name": "Primavera",
  "slug": "primavera",
  "category": "ocasión",
  "usageCount": 15,
  "isActive": true
}
```

## 🎨 Panel de Administración - Flujo de Creación

### Formulario de Producto - Paso 1: Tipo

```
┌─────────────────────────────────────────────────────────┐
│ Crear Nuevo Producto - Paso 1: Tipo                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Selecciona el tipo de producto:                         │
│                                                          │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│ │  🧸      │  │  🧶      │  │  📚      │  │  📦      ││
│ │ Muñeco   │  │ Material │  │  Curso   │  │   Kit    ││
│ └──────────┘  └──────────┘  └──────────┘  └──────────┘│
│                                                          │
│ [Siguiente]                                              │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Formulario de Producto - Paso 2: Información Básica

```
┌─────────────────────────────────────────────────────────┐
│ Crear Nuevo Producto - Paso 2: Información Básica       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Nombre: [_________________________________]              │
│                                                          │
│ Descripción:                                             │
│ [_______________________________________________]        │
│ [_______________________________________________]        │
│                                                          │
│ Precio: [$________]                                      │
│                                                          │
│ Stock: [____]                                            │
│                                                          │
│ Imagen principal: [Seleccionar archivo...]              │
│                                                          │
│ Galería de imágenes: [Agregar imágenes...]              │
│                                                          │
│ [Anterior]  [Siguiente]                                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Formulario de Producto - Paso 3: Detalles Específicos

#### Si es MUÑECO:
```
┌─────────────────────────────────────────────────────────┐
│ Crear Nuevo Producto - Paso 3: Detalles del Muñeco      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Público objetivo: [Personalizable ▼]                    │
│                                                          │
│ Género del muñeco: [Unisex ▼]                           │
│                                                          │
│ Dificultad: [Intermedio ▼]                              │
│                                                          │
│ Tiempo de producción: [__] días                         │
│                                                          │
│ ☑ Permite personalización                               │
│                                                          │
│ Materiales utilizados:                                   │
│ ┌────────────────────────────────────────────────┐     │
│ │ [Buscar material...] [+ Crear nuevo]           │     │
│ │                                                 │     │
│ │ Seleccionados:                                  │     │
│ │ • Hilo acrílico rojo [x]                       │     │
│ │ • Relleno hipoalergénico [x]                   │     │
│ │ • Ojos de seguridad 12mm [x]                   │     │
│ └────────────────────────────────────────────────┘     │
│                                                          │
│ [Anterior]  [Siguiente]                                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### Si es MATERIAL:
```
┌─────────────────────────────────────────────────────────┐
│ Crear Nuevo Producto - Paso 3: Detalles del Material    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Tipo de material: [Hilo ▼]                              │
│                                                          │
│ Marca: [_________________________________]               │
│                                                          │
│ Color: [_________________________________]               │
│                                                          │
│ Tamaño/Grosor: [_________________________________]       │
│                                                          │
│ Cantidad: [_________________________________]            │
│                                                          │
│ Composición: [_________________________________]         │
│                                                          │
│ [Anterior]  [Siguiente]                                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### Si es CURSO:
```
┌─────────────────────────────────────────────────────────┐
│ Crear Nuevo Producto - Paso 3: Detalles del Curso       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Dificultad: [Principiante ▼]                            │
│                                                          │
│ Duración: [_________________________________]            │
│                                                          │
│ Formato: [Online ▼]                                     │
│                                                          │
│ Instructor: [_________________________________]          │
│                                                          │
│ Materiales incluidos:                                    │
│ ┌────────────────────────────────────────────────┐     │
│ │ [Buscar material...] [+ Crear nuevo]           │     │
│ │                                                 │     │
│ │ Seleccionados:                                  │     │
│ │ • Kit básico de crochet [x]                    │     │
│ │ • Libro de patrones [x]                        │     │
│ └────────────────────────────────────────────────┘     │
│                                                          │
│ [Anterior]  [Siguiente]                                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### Si es KIT:
```
┌─────────────────────────────────────────────────────────┐
│ Crear Nuevo Producto - Paso 3: Detalles del Kit         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Tipo de kit: [Principiante ▼]                           │
│                                                          │
│ Público objetivo: [Todos ▼]                             │
│                                                          │
│ ☑ Permite selección de materiales                       │
│                                                          │
│ Materiales incluidos (obligatorios):                     │
│ ┌────────────────────────────────────────────────┐     │
│ │ [Buscar material...] [+ Crear nuevo]           │     │
│ │                                                 │     │
│ │ • Hilo acrílico (5 colores) [x]                │     │
│ │ • Agujas de crochet (set 3) [x]                │     │
│ │ • Relleno 200g [x]                             │     │
│ └────────────────────────────────────────────────┘     │
│                                                          │
│ Materiales opcionales:                                   │
│ ┌────────────────────────────────────────────────┐     │
│ │ [Buscar material...] [+ Crear nuevo]           │     │
│ │                                                 │     │
│ │ • Ojos de seguridad [x]                        │     │
│ │ • Marcadores de puntos [x]                     │     │
│ └────────────────────────────────────────────────┘     │
│                                                          │
│ [Anterior]  [Siguiente]                                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Formulario de Producto - Paso 4: Personalizaciones y Tags

```
┌─────────────────────────────────────────────────────────┐
│ Crear Nuevo Producto - Paso 4: Extras                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Personalizaciones disponibles:                          │
│ (Solo para Muñecos y Kits)                              │
│ ┌────────────────────────────────────────────────┐     │
│ │ [Buscar personalización...] [+ Crear nueva]    │     │
│ │                                                 │     │
│ │ Seleccionadas:                                  │     │
│ │ ☑ Moño en el cuello (+$4,000) [Por defecto]   │     │
│ │ ☑ Corona de flores (+$6,000)                   │     │
│ │ ☑ Caja de regalo (+$8,000)                     │     │
│ └────────────────────────────────────────────────┘     │
│                                                          │
│ Tags:                                                    │
│ ┌────────────────────────────────────────────────┐     │
│ │ [Buscar tag...] [+ Crear nuevo]                │     │
│ │                                                 │     │
│ │ Seleccionados:                                  │     │
│ │ • primavera [x]                                │     │
│ │ • regalo [x]                                   │     │
│ │ • personalizable [x]                           │     │
│ └────────────────────────────────────────────────┘     │
│                                                          │
│ [Anterior]  [Guardar Producto]                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 🔍 Componentes de Selección Inteligente

### Selector de Material (Autocomplete)

```typescript
// Componente: MaterialSelectorComponent
interface MaterialSelectorProps {
  selectedMaterials: Material[];
  onMaterialsChange: (materials: Material[]) => void;
}

// Funcionalidad:
// 1. Buscar materiales existentes (autocomplete)
// 2. Si no existe, botón "Crear nuevo material"
// 3. Modal para crear material rápido
// 4. Agregar a la lista de seleccionados
```

```
┌─────────────────────────────────────────────────────────┐
│ Selector de Materiales                                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ [Buscar material...                    ] [+ Crear nuevo]│
│                                                          │
│ Sugerencias:                                             │
│ ┌────────────────────────────────────────────────┐     │
│ │ • Hilo acrílico rojo - Anchor                  │     │
│ │ • Hilo acrílico azul - Anchor                  │     │
│ │ • Hilo algodón blanco - DMC                    │     │
│ └────────────────────────────────────────────────┘     │
│                                                          │
│ Materiales seleccionados:                                │
│ ┌────────────────────────────────────────────────┐     │
│ │ • Hilo acrílico rojo [x]                       │     │
│ │ • Relleno hipoalergénico [x]                   │     │
│ └────────────────────────────────────────────────┘     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Modal de Creación Rápida de Material

```
┌─────────────────────────────────────────────────────────┐
│ Crear Nuevo Material                                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Nombre: [_________________________________]              │
│                                                          │
│ Tipo: [Hilo ▼]                                          │
│                                                          │
│ Marca: [_________________________________]               │
│                                                          │
│ Color: [_________________________________]               │
│                                                          │
│ ☐ Este material también es un producto vendible         │
│                                                          │
│ [Cancelar]  [Crear y Agregar]                           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Selector de Personalización (Similar)

```
┌─────────────────────────────────────────────────────────┐
│ Selector de Personalizaciones                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ [Buscar personalización...             ] [+ Crear nueva]│
│                                                          │
│ Sugerencias:                                             │
│ ┌────────────────────────────────────────────────┐     │
│ │ • Moño en el cuello (+$4,000)                  │     │
│ │ • Corona de flores (+$6,000)                   │     │
│ │ • Caja de regalo (+$8,000)                     │     │
│ └────────────────────────────────────────────────┘     │
│                                                          │
│ Personalizaciones seleccionadas:                         │
│ ┌────────────────────────────────────────────────┐     │
│ │ ☑ Moño en el cuello (+$4,000) [Por defecto]   │     │
│ │ ☑ Corona de flores (+$6,000)                   │     │
│ └────────────────────────────────────────────────┘     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Selector de Tags (Similar)

```
┌─────────────────────────────────────────────────────────┐
│ Selector de Tags                                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ [Buscar tag...                          ] [+ Crear nuevo]│
│                                                          │
│ Sugerencias:                                             │
│ ┌────────────────────────────────────────────────┐     │
│ │ • primavera (15 productos)                     │     │
│ │ • regalo (23 productos)                        │     │
│ │ • personalizable (8 productos)                 │     │
│ └────────────────────────────────────────────────┘     │
│                                                          │
│ Tags seleccionados:                                      │
│ ┌────────────────────────────────────────────────┐     │
│ │ • primavera [x]                                │     │
│ │ • regalo [x]                                   │     │
│ └────────────────────────────────────────────────┘     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 📋 Resumen de Campos por Tipo de Producto

### Campos Comunes (TODOS)
- ✅ name
- ✅ description
- ✅ price
- ✅ stock
- ✅ imageUrl
- ✅ imageGallery
- ✅ isAvailable
- ✅ tagIds

### Campos por Tipo

| Campo                  | Muñeco | Material | Curso | Kit |
|------------------------|--------|----------|-------|-----|
| targetAudience         | ✅     | ❌       | ❌    | ⚠️  |
| dollGender             | ✅     | ❌       | ❌    | ❌  |
| difficulty             | ✅     | ❌       | ✅    | ❌  |
| productionTimeDays     | ✅     | ❌       | ❌    | ❌  |
| materialIds            | ✅     | ❌       | ❌    | ❌  |
| customizationIds       | ✅     | ❌       | ❌    | ✅  |
| materialType           | ❌     | ✅       | ❌    | ❌  |
| brand                  | ❌     | ✅       | ❌    | ❌  |
| color                  | ❌     | ✅       | ❌    | ❌  |
| size                   | ❌     | ✅       | ❌    | ❌  |
| composition            | ❌     | ✅       | ❌    | ❌  |
| duration               | ❌     | ❌       | ✅    | ❌  |
| format                 | ❌     | ❌       | ✅    | ❌  |
| instructor             | ❌     | ❌       | ✅    | ❌  |
| includedMaterialIds    | ❌     | ❌       | ✅    | ✅  |
| optionalMaterialIds    | ❌     | ❌       | ❌    | ✅  |
| allowMaterialSelection | ❌     | ❌       | ❌    | ✅  |

⚠️ = Opcional

## 🎯 Ventajas de Esta Arquitectura

### 1. Sin Duplicación
```
❌ Antes: "Moño" copiado en 50 productos
✅ Ahora: "Moño" existe 1 vez, referenciado 50 veces
```

### 2. Mantenimiento Fácil
```
Cambiar precio de "Moño":
- Actualizar 1 registro en customizations
- Automáticamente se refleja en todos los productos
```

### 3. Campos Relevantes
```
❌ Antes: Material con campo "targetAudience" (no tiene sentido)
✅ Ahora: Solo muñecos y kits tienen targetAudience
```

### 4. Creación Rápida
```
Crear muñeco:
1. Buscar "Hilo rojo" → Existe → Seleccionar
2. Buscar "Hilo azul" → No existe → Crear nuevo → Seleccionar
3. Buscar "Moño" → Existe → Seleccionar
4. Guardar producto
```

### 5. Estadísticas
```sql
-- Tags más usados
SELECT t.name, t.usageCount
FROM tags t
ORDER BY t.usageCount DESC
LIMIT 10;

-- Personalizaciones más populares
SELECT c.name, COUNT(*) as times_used
FROM customizations c
JOIN products p ON c.id IN p.customizationIds
GROUP BY c.id
ORDER BY times_used DESC;
```

## 🚀 Implementación Recomendada

### Fase 1: Backend
1. Crear modelos: Customization, Material, Tag
2. Crear endpoints CRUD para cada uno
3. Actualizar modelo Product con campos condicionales
4. Crear endpoints de búsqueda/autocomplete

### Fase 2: Frontend - Componentes Reutilizables
1. MaterialSelectorComponent
2. CustomizationSelectorComponent
3. TagSelectorComponent
4. Formulario dinámico según productType

### Fase 3: Panel de Admin
1. Gestión de Personalizaciones
2. Gestión de Materiales
3. Gestión de Tags
4. Formulario de producto con selectores inteligentes

### Fase 4: Migración
1. Script para extraer datos únicos
2. Crear registros en nuevas colecciones
3. Actualizar productos con IDs
4. Verificar integridad

## 📊 Ejemplo Completo

### Crear Muñeco "Conejito Primavera"

```json
// 1. Producto base
{
  "id": "mu-001",
  "name": "Conejito Primavera",
  "description": "Muñeco tejido a mano...",
  "price": 58000,
  "stock": 5,
  "productType": "doll",
  "category": "Muñecos",
  "tagIds": ["tag-001", "tag-005", "tag-012"],
  
  "dollData": {
    "targetAudience": "Personalizable",
    "dollGender": "Unisex",
    "difficulty": "Intermedio",
    "productionTimeDays": 5,
    "allowPersonalization": true,
    "materialIds": ["mat-001", "mat-015", "mat-023"],
    "customizationIds": ["custom-001", "custom-002", "custom-008"],
    "defaultCustomizationIds": ["custom-001"]
  }
}

// 2. Referencias resueltas automáticamente
// Tags: primavera, regalo, personalizable
// Materiales: Hilo rojo, Relleno, Ojos 12mm
// Personalizaciones: Moño (default), Corona, Caja regalo
```

## ✅ Recomendación Final

Esta arquitectura es:
- ✅ Escalable
- ✅ Mantenible
- ✅ Sin duplicación
- ✅ Campos relevantes por tipo
- ✅ Fácil de usar para admin
- ✅ Preparada para crecimiento

**¿Procedo con la implementación?**
