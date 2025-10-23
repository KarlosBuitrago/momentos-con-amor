# Funcionalidades del Panel de Administración

## Componentes del Admin

### 1. AdminPanelComponent (`admin-panel`)
- **Ruta**: `/admin`
- **Descripción**: Panel principal con pestañas para gestionar y agregar productos
- **Características**:
  - Sistema de pestañas (Gestionar productos / Agregar producto)
  - Botón de cerrar sesión
  - Protección de ruta (solo usuarios admin)

### 2. AdminManageProductsComponent (`admin-manage-products`)
- **Descripción**: Lista y gestión de productos existentes
- **Características**:
  - Búsqueda por nombre, descripción o ID
  - Filtro por categoría (Todos, Muñecos, Materiales, Cursos)
  - Visualización de productos con imagen, precio, stock y disponibilidad
  - Botones de acción: Editar y Eliminar
  - Confirmación antes de eliminar

### 3. AdminAddProductComponent (`admin-add-product`)
- **Descripción**: Formulario para crear nuevos productos
- **Características**:
  - Formulario completo con todos los campos del producto
  - Validación en tiempo real
  - Soporte para categorías: Muñecos, Materiales, Cursos
  - Campos dinámicos según categoría
  - Gestión de arrays (materiales, imágenes, tags, personalizaciones)

### 4. AdminEditProductComponent (`admin-edit-product`)
- **Ruta**: `/admin/productos/editar/:id`
- **Descripción**: Formulario para editar productos existentes
- **Características**:
  - Carga automática de datos del producto
  - Mismo formulario que AdminAddProduct pero con datos pre-poblados
  - Botón de cancelar que regresa al panel principal
  - Redirección automática después de guardar

## Flujo de Trabajo

### Gestionar Productos
1. Usuario admin accede a `/admin`
2. Por defecto se muestra la pestaña "Gestionar productos"
3. Puede buscar productos por texto o filtrar por categoría
4. Al hacer clic en "Editar", navega a `/admin/productos/editar/:id`
5. Al hacer clic en "Eliminar", muestra confirmación y elimina el producto

### Agregar Producto
1. Usuario admin hace clic en la pestaña "Agregar producto"
2. Completa el formulario con la información del producto
3. El formulario valida los campos requeridos
4. Al guardar, el producto se crea en el backend
5. Muestra mensaje de éxito y limpia el formulario

### Editar Producto
1. Usuario navega desde "Gestionar productos" → "Editar"
2. El formulario carga los datos del producto
3. Usuario modifica los campos necesarios
4. Al guardar, actualiza el producto en el backend
5. Muestra mensaje de éxito y redirige al panel principal

## Servicios Utilizados

### ProductService
- `getProducts()`: Obtiene todos los productos con filtros opcionales
- `getProductById(id)`: Obtiene un producto específico
- `createProductRemote(product)`: Crea un nuevo producto (solo backend)
- `updateProduct(id, product)`: Actualiza un producto existente
- `deleteProduct(id)`: Elimina un producto

### AuthService
- `isAuthenticated()`: Verifica si hay un usuario autenticado
- `isAdmin()`: Verifica si el usuario tiene rol de admin
- `logout()`: Cierra la sesión del usuario

## Protección de Rutas

Todas las rutas del admin están protegidas con:
```typescript
canActivate: [() => inject(AuthService).isAuthenticated() && inject(AuthService).isAdmin() ? true : inject(Router).createUrlTree(['/login'])]
```

Si el usuario no está autenticado o no es admin, se redirige a `/login`.
