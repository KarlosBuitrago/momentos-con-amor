# Arquitectura de Personalizaciones - Sistema Escalable

## Estructura de Datos Propuesta

### Colección: `customizations`

```typescript
interface Customization {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'accessory' | 'packaging' | 'embroidery' | 'color' | 'material';
  applicableTo: ('doll' | 'kit' | 'material' | 'course')[];
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Ejemplo:**
```json
{
  "id": "custom-001",
  "name": "Moño en el cuello",
  "description": "Moño decorativo de tela suave",
  "price": 4000,
  "category": "accessory",
  "applicableTo": ["doll", "kit"],
  "imageUrl": "assets/customizations/bow.jpg",
  "isActive": true,
  "sortOrder": 1,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

### Colección: `products` (Actualizada)

```typescript
interface Product {
  // ... campos existentes
  customizationIds: string[];  // IDs de personalizaciones disponibles
  allowCustomizations: boolean; // Si permite personalizaciones
  defaultCustomizationIds?: string[]; // Personalizaciones seleccionadas por defecto
}
```

**Ejemplo:**
```json
{
  "id": "mu-001",
  "name": "Conejito Primavera",
  "price": 58000,
  "customizationIds": ["custom-001", "custom-002", "custom-005"],
  "allowCustomizations": true,
  "defaultCustomizationIds": ["custom-001"]
}
```

## Categorías de Personalizaciones

### 1. Accesorios (accessory)
- Moños
- Coronas de flores
- Bufandas
- Sombreros
- Llaveros

### 2. Empaques (packaging)
- Caja de regalo básica
- Caja de regalo premium
- Bolsa de tela
- Empaque deluxe con moño
- Tarjeta personalizada

### 3. Bordados (embroidery)
- Nombre bordado
- Fecha especial
- Mensaje corto
- Iniciales

### 4. Colores (color)
- Hilo especial dorado
- Hilo especial plateado
- Combinación de colores personalizada
- Ojos de color específico

### 5. Materiales (material)
- Relleno premium
- Hilo orgánico
- Detalles brillantes
- Fragancia suave

## Flujo de Datos

### Backend

#### 1. Modelo de Customization
```javascript
// backend/src/models/Customization.js
class Customization {
  static async getAll(filters = {}) {
    let query = customizationsCollection;
    
    if (filters.category) {
      query = query.where('category', '==', filters.category);
    }
    
    if (filters.isActive !== undefined) {
      query = query.where('isActive', '==', filters.isActive);
    }
    
    if (filters.applicableTo) {
      query = query.where('applicableTo', 'array-contains', filters.applicableTo);
    }
    
    const snapshot = await query.orderBy('sortOrder').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  static async getById(id) { /* ... */ }
  static async create(data) { /* ... */ }
  static async update(id, data) { /* ... */ }
  static async delete(id) { /* ... */ }
}
```

#### 2. Endpoint para Obtener Producto con Personalizaciones
```javascript
// backend/src/controllers/productController.js
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Cargar personalizaciones si el producto las tiene
    if (product.customizationIds && product.customizationIds.length > 0) {
      const customizations = await Customization.getByIds(product.customizationIds);
      product.customizations = customizations;
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};
```

### Frontend

#### 1. Servicio de Personalizaciones
```typescript
// frontend/src/app/services/customization.service.ts
@Injectable({ providedIn: 'root' })
export class CustomizationService {
  private apiUrl = `${environment.apiUrl}/customizations`;
  
  getAll(filters?: any): Observable<Customization[]> {
    return this.http.get<Customization[]>(this.apiUrl, { params: filters });
  }
  
  getById(id: string): Observable<Customization> {
    return this.http.get<Customization>(`${this.apiUrl}/${id}`);
  }
  
  getByIds(ids: string[]): Observable<Customization[]> {
    return this.http.post<Customization[]>(`${this.apiUrl}/batch`, { ids });
  }
  
  create(customization: Customization): Observable<Customization> {
    return this.http.post<Customization>(this.apiUrl, customization);
  }
  
  update(id: string, customization: Partial<Customization>): Observable<Customization> {
    return this.http.put<Customization>(`${this.apiUrl}/${id}`, customization);
  }
  
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
```

#### 2. Cargar Producto con Personalizaciones
```typescript
// En el componente
loadProduct(id: string): void {
  this.productService.getProductById(id).subscribe({
    next: (product) => {
      this.product = product;
      
      // Las personalizaciones ya vienen cargadas desde el backend
      // O puedes cargarlas por separado:
      if (product.customizationIds?.length) {
        this.customizationService.getByIds(product.customizationIds).subscribe({
          next: (customizations) => {
            this.product.customizations = customizations;
          }
        });
      }
    }
  });
}
```

## Panel de Administración

### Gestión de Personalizaciones

#### Vista de Lista
```
┌─────────────────────────────────────────────────────────┐
│ Gestión de Personalizaciones                            │
├─────────────────────────────────────────────────────────┤
│ [+ Nueva Personalización]  [Filtrar por categoría ▼]   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ 🎀 Moño en el cuello                             │   │
│ │ Categoría: Accesorio | Precio: $4,000           │   │
│ │ Aplicable a: Muñecos, Kits                      │   │
│ │ [Editar] [Desactivar] [Eliminar]                │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ 👑 Corona de flores                              │   │
│ │ Categoría: Accesorio | Precio: $6,000           │   │
│ │ Aplicable a: Muñecos                             │   │
│ │ [Editar] [Desactivar] [Eliminar]                │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### Formulario de Creación/Edición
```
┌─────────────────────────────────────────────────────────┐
│ Nueva Personalización                                    │
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
│ Categoría: [Accesorio ▼]                                │
│                                                          │
│ Aplicable a:                                             │
│ ☑ Muñecos  ☑ Kits  ☐ Materiales  ☐ Cursos              │
│                                                          │
│ Imagen: [Seleccionar archivo...]                        │
│                                                          │
│ ☑ Activa                                                 │
│                                                          │
│ [Cancelar]  [Guardar]                                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Asignar Personalizaciones a Productos

En el formulario de edición de producto:

```
┌─────────────────────────────────────────────────────────┐
│ Editar Producto: Conejito Primavera                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ ... campos del producto ...                             │
│                                                          │
│ ☑ Permitir personalizaciones                            │
│                                                          │
│ Personalizaciones disponibles:                          │
│ ┌────────────────────────────────────────────────┐     │
│ │ ☑ Moño en el cuello (+$4,000)                  │     │
│ │ ☑ Corona de flores (+$6,000)                   │     │
│ │ ☐ Bufanda adicional (+$5,000)                  │     │
│ │ ☑ Caja de regalo (+$8,000) [Por defecto]      │     │
│ │ ☐ Nombre bordado (+$6,500)                     │     │
│ └────────────────────────────────────────────────┘     │
│                                                          │
│ [Guardar]  [Cancelar]                                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Ventajas del Sistema

### 1. Mantenimiento Centralizado
```
Cambiar precio de "Moño":
- Actual: Actualizar 50 productos ❌
- Nuevo: Actualizar 1 personalización ✅
```

### 2. Reutilización
```
Crear nuevo muñeco:
- Actual: Copiar y pegar personalizaciones ❌
- Nuevo: Seleccionar de lista existente ✅
```

### 3. Estadísticas
```sql
-- Personalizaciones más populares
SELECT c.name, COUNT(*) as times_selected
FROM order_items oi
JOIN order_customizations oc ON oi.id = oc.order_item_id
JOIN customizations c ON oc.customization_id = c.id
GROUP BY c.id
ORDER BY times_selected DESC
```

### 4. Gestión de Inventario
```
Si una personalización requiere material específico:
- Puedes rastrear cuántas veces se ha pedido
- Alertar cuando el material esté bajo
- Desactivar temporalmente si no hay stock
```

## Migración desde Sistema Actual

### Script de Migración

```javascript
// backend/src/scripts/migrateCustomizations.js
async function migrateCustomizations() {
  // 1. Extraer todas las personalizaciones únicas
  const products = await Product.getAll();
  const uniqueCustomizations = new Map();
  
  products.forEach(product => {
    if (product.customizations) {
      product.customizations.forEach(custom => {
        const key = `${custom.label}-${custom.price}`;
        if (!uniqueCustomizations.has(key)) {
          uniqueCustomizations.set(key, {
            name: custom.label,
            price: custom.price,
            category: inferCategory(custom.label),
            applicableTo: ['doll'],
            isActive: true,
            sortOrder: uniqueCustomizations.size + 1
          });
        }
      });
    }
  });
  
  // 2. Crear personalizaciones en Firestore
  const customizationMap = new Map();
  for (const [key, customData] of uniqueCustomizations) {
    const customization = await Customization.create(customData);
    customizationMap.set(key, customization.id);
  }
  
  // 3. Actualizar productos con IDs de personalizaciones
  for (const product of products) {
    if (product.customizations) {
      const customizationIds = product.customizations.map(custom => {
        const key = `${custom.label}-${custom.price}`;
        return customizationMap.get(key);
      });
      
      await Product.update(product.id, {
        customizationIds,
        allowCustomizations: true
      });
    }
  }
  
  console.log('✅ Migración completada');
}
```

## Recomendación Final

**Implementa el sistema de tabla de personalizaciones** porque:

1. ✅ Es más escalable
2. ✅ Más fácil de mantener
3. ✅ Permite reutilización
4. ✅ Mejor experiencia de administración
5. ✅ Permite estadísticas y análisis
6. ✅ Preparado para crecimiento futuro

El costo inicial de implementación se recupera rápidamente con la facilidad de mantenimiento y la flexibilidad que ofrece.

## Próximos Pasos

1. Crear modelo `Customization` en el backend
2. Crear endpoints para CRUD de personalizaciones
3. Crear servicio en el frontend
4. Crear componente de administración de personalizaciones
5. Actualizar formulario de productos para usar el nuevo sistema
6. Migrar datos existentes
7. Actualizar modal de personalización para cargar desde el nuevo sistema
