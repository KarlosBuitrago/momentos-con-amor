---
inclusion: manual
---

# Filtrado de Productos por Categoría

## Cambios Implementados

### 1. Backend - Productos de Ejemplo

Se agregaron productos de ejemplo para las categorías de **Materiales** y **Cursos** en el controlador de productos:

**Materiales (4 productos):**
- Hilo Acrílico Premium - Set 10 colores
- Agujas de Crochet - Set Completo
- Relleno Hipoalergénico Premium - 500g
- Kit Completo para Principiantes

**Cursos (3 productos):**
- Curso Básico de Crochet
- Curso Avanzado: Amigurumis Realistas
- Taller: Crea tu Primer Muñeco

### 2. Script de Población

Se creó el script `backend/src/scripts/seedAllProducts.js` que permite poblar la base de datos con todos los productos de ejemplo (muñecos, materiales y cursos).

**Uso:**
```bash
node backend/src/scripts/seedAllProducts.js
```

### 3. Frontend - Filtrado por Categoría

Se actualizaron los componentes del frontend para filtrar correctamente los productos por categoría:

#### ProductCatalogComponent (Muñecos)
- Filtra productos con `category === 'Muñecos'` o `productType === 'doll'`
- Solo muestra muñecos en la página principal de productos

#### CrochetMaterialsComponent (Materiales)
- Filtra productos con `category === 'Materiales'` o `productType === 'material'`
- Solo muestra materiales en la página de materiales

#### CoursesComponent (Cursos)
- Filtra productos con `category === 'Cursos'`, `isCourse === true` o `productType === 'course'`
- Solo muestra cursos en la página de cursos

### 4. Imágenes por Defecto

Se crearon imágenes SVG por defecto para:
- `frontend/tienda-ropa/public/assets/images/default-material.svg`
- `frontend/tienda-ropa/public/assets/images/default-course.svg`

## Estructura de Categorías

### Categorías Principales
- **Muñecos**: Productos tejidos a mano (amigurumis, muñecos personalizados)
- **Materiales**: Hilos, agujas, rellenos, kits de inicio
- **Cursos**: Cursos online, talleres, clases en vivo

### Campos de Identificación

Cada producto puede ser identificado por:
1. `category`: String con el nombre de la categoría ("Muñecos", "Materiales", "Cursos")
2. `productType`: Enum con valores 'doll', 'material', 'course'
3. `isCourse`: Boolean que indica si es un curso (para compatibilidad)

## Scripts Útiles

### Poblar Base de Datos
```bash
node backend/src/scripts/seedAllProducts.js
```

### Corregir Producto con Categoría Incorrecta
Si un producto tiene `category: "Cursos"` pero `productType: "material"`, usar:
```bash
node backend/src/scripts/fixCourseProduct.js
```

## Verificación

Para verificar que el filtrado funciona correctamente:

1. Iniciar el backend:
```bash
cd backend
npm run dev
```

2. Poblar la base de datos (si es necesario):
```bash
node backend/src/scripts/seedAllProducts.js
```

3. Verificar productos en el backend:
```bash
curl http://localhost:3000/api/products
```

4. Iniciar el frontend:
```bash
cd frontend/tienda-ropa
npm start
```

5. Navegar a las diferentes páginas:
   - `/productos` - Solo debe mostrar muñecos
   - `/materiales` - Solo debe mostrar materiales
   - `/cursos` - Solo debe mostrar cursos

## Solución de Problemas

### Producto aparece en categoría incorrecta

Si un producto aparece en una categoría incorrecta, verificar que tenga los campos correctos:

**Para Muñecos:**
- `category: "Muñecos"`
- `productType: "doll"`
- `isCourse: false`

**Para Materiales:**
- `category: "Materiales"`
- `productType: "material"`
- `isCourse: false`

**Para Cursos:**
- `category: "Cursos"`
- `productType: "course"`
- `isCourse: true`

Si los campos no coinciden, el producto puede aparecer en múltiples categorías o en la incorrecta.
