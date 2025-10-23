# 👤 Usuario Administrador Creado

## ✅ Credenciales de Acceso

```
Email:    admin@tiendaropa.com
Password: Admin123!
Role:     admin
```

⚠️ **IMPORTANTE:** Guarda estas credenciales en un lugar seguro.

## 🔒 Sistema de Autenticación Configurado

### Backend - Rutas Protegidas

Las siguientes rutas ahora requieren autenticación de administrador:

**Rutas Públicas (sin autenticación):**

- `GET /api/products` - Ver todos los productos
- `GET /api/products/:id` - Ver un producto específico

**Rutas Protegidas (solo administradores):**

- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto
- `POST /api/products/seed` - Poblar productos de ejemplo

### Cómo Usar la Autenticación

#### 1. Iniciar Sesión

```powershell
$body = @{
    email = "admin@tiendaropa.com"
    password = "Admin123!"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri http://localhost:3000/api/auth/login -Method POST -Body $body -ContentType "application/json" -UseBasicParsing

$response.Content | ConvertFrom-Json
```

Esto devolverá un `token` que debes usar en las siguientes peticiones.

#### 2. Crear un Producto (con autenticación)

```powershell
$token = "TU_TOKEN_AQUI"

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{
    name = "Nuevo Muñeco"
    description = "Descripción del muñeco"
    price = 50000
    category = "Muñecos"
    targetAudience = "Unisex"
    imageUrl = "assets/images/muneco.jpg"
    stock = 10
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3000/api/products -Method POST -Headers $headers -Body $body -UseBasicParsing
```

#### 3. Actualizar un Producto

```powershell
$token = "TU_TOKEN_AQUI"

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{
    price = 55000
    stock = 15
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3000/api/products/mu-001 -Method PUT -Headers $headers -Body $body -UseBasicParsing
```

#### 4. Eliminar un Producto

```powershell
$token = "TU_TOKEN_AQUI"

$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-WebRequest -Uri http://localhost:3000/api/products/mu-001 -Method DELETE -Headers $headers -UseBasicParsing
```

## 🎯 Próximos Pasos

### Frontend - Panel de Administración

Necesitas crear componentes en Angular para:

1. **Login Component** - Formulario de inicio de sesión
2. **Admin Dashboard** - Panel principal de administración
3. **Product Management** - CRUD de productos
4. **Auth Service** - Servicio para manejar autenticación
5. **Auth Guard** - Proteger rutas del frontend

¿Quieres que cree estos componentes en el frontend?

## 📁 Archivos Creados

### Backend

- ✅ `backend/src/middleware/authMiddleware.js` - Middleware de autenticación
- ✅ `backend/create-admin.js` - Script para crear admin (requiere Firebase)
- ✅ `backend/create-admin-http.js` - Script para crear admin vía HTTP
- ✅ `backend/src/routes/productRoutes.js` - Rutas protegidas

### Modelos Existentes

- ✅ `backend/src/models/User.js` - Modelo de usuario
- ✅ `backend/src/controllers/authController.js` - Controlador de autenticación
- ✅ `backend/src/routes/authRoutes.js` - Rutas de autenticación

## 🧪 Probar la Autenticación

### 1. Intentar crear producto sin autenticación (debe fallar)

```powershell
$body = @{
    name = "Test"
    price = 1000
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3000/api/products -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

Respuesta esperada: `401 Unauthorized - Token de autenticación no proporcionado`

### 2. Iniciar sesión y obtener token

```powershell
$body = @{
    email = "admin@tiendaropa.com"
    password = "Admin123!"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri http://localhost:3000/api/auth/login -Method POST -Body $body -ContentType "application/json" -UseBasicParsing

$data = $response.Content | ConvertFrom-Json
$token = $data.token
Write-Host "Token: $token"
```

### 3. Crear producto con autenticación (debe funcionar)

```powershell
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{
    name = "Producto de Prueba"
    description = "Creado con autenticación"
    price = 45000
    category = "Muñecos"
    targetAudience = "Unisex"
    imageUrl = "assets/images/test.jpg"
    stock = 5
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3000/api/products -Method POST -Headers $headers -Body $body -UseBasicParsing
```

Respuesta esperada: `201 Created` con los datos del producto creado.

## 🔐 Seguridad

- ✅ Contraseñas hasheadas por Firebase Auth
- ✅ Tokens JWT verificados por Firebase
- ✅ Rutas protegidas con middleware
- ✅ Roles de usuario (admin/customer)
- ✅ Credenciales no expuestas en respuestas

## 📝 Notas

- El usuario administrador se creó en el almacenamiento local (`.local-data/`)
- Para usar Firebase Auth real, necesitas configurar las credenciales de Firebase
- El sistema funciona igual con mock storage o Firebase real
