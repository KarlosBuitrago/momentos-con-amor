# 🔐 Sistema de Login y Administración

## ✅ Implementación Completada

Se ha implementado un sistema completo de autenticación con las siguientes características:

### 🎯 Funcionalidades

1. **Botón Login en Navbar**
   - Visible solo cuando NO hay usuario autenticado
   - Redirige a la página de login

2. **Menú Admin en Navbar**
   - Visible solo cuando el usuario es administrador
   - Oculto para usuarios no autenticados

3. **Botón Cerrar Sesión**
   - Visible cuando hay usuario autenticado
   - Muestra el nombre del usuario
   - Cierra la sesión y redirige al inicio

4. **Página de Login**
   - Formulario de inicio de sesión
   - Validación de credenciales
   - Mensajes de error
   - Credenciales de prueba visibles

5. **Protección de Rutas**
   - La ruta `/admin` solo es accesible para administradores
   - Redirige a `/login` si no está autenticado

## 📁 Archivos Creados

### Frontend
- ✅ `frontend/tienda-ropa/src/app/services/auth.service.ts` - Servicio de autenticación
- ✅ `frontend/tienda-ropa/src/app/components/login/login.component.ts` - Componente de login
- ✅ `frontend/tienda-ropa/src/app/components/login/login.component.html` - Template de login
- ✅ `frontend/tienda-ropa/src/app/components/login/login.component.scss` - Estilos de login
- ✅ `frontend/tienda-ropa/src/app/guards/admin.guard.ts` - Guard para proteger rutas
- ✅ `frontend/tienda-ropa/src/app/app.component.ts` - Actualizado con lógica de auth
- ✅ `frontend/tienda-ropa/src/app/app.component.html` - Navbar con login/logout
- ✅ `frontend/tienda-ropa/src/app/app.component.scss` - Estilos para botones
- ✅ `frontend/tienda-ropa/src/app/app.routes.ts` - Rutas con protección

## 🔑 Credenciales de Administrador

```
Email:    admin@tiendaropa.com
Password: Admin123!
```

## 🚀 Cómo Usar

### 1. Iniciar la Aplicación

Asegúrate de que el backend esté corriendo:
```bash
cd backend
npm run dev
```

Inicia el frontend:
```bash
cd frontend/tienda-ropa
npm start
```

### 2. Flujo de Usuario

**Usuario No Autenticado:**
1. Abre http://localhost:4200
2. En el navbar verás: Inicio | Materiales | Cursos | Carrito | **Login**
3. El menú "Admin" NO es visible

**Iniciar Sesión:**
1. Haz clic en "Login"
2. Ingresa las credenciales:
   - Email: admin@tiendaropa.com
   - Password: Admin123!
3. Haz clic en "Iniciar Sesión"

**Usuario Autenticado (Admin):**
1. Después del login, serás redirigido a `/admin`
2. En el navbar verás: Inicio | Materiales | Cursos | Carrito | **Admin** | **Cerrar Sesión (Administrador)**
3. El botón "Login" ya NO es visible
4. Puedes acceder al panel de administración

**Cerrar Sesión:**
1. Haz clic en "Cerrar Sesión (Administrador)"
2. Serás redirigido a la página de inicio
3. El navbar vuelve a mostrar "Login" en lugar de "Admin"

## 🔒 Seguridad

### Protección de Rutas
- La ruta `/admin` está protegida con un guard
- Si intentas acceder sin autenticación, serás redirigido a `/login`
- Solo usuarios con rol "admin" pueden acceder

### Almacenamiento de Token
- El token se guarda en `localStorage`
- Se verifica automáticamente al cargar la aplicación
- Se elimina al cerrar sesión

### Verificación de Token
- El token se verifica con el backend
- Si el token es inválido, se limpia automáticamente
- El usuario debe iniciar sesión nuevamente

## 🎨 Interfaz

### Navbar
- **Login Button:** Fondo semi-transparente con borde
- **Logout Button:** Fondo rojizo para indicar acción de salida
- **Admin Link:** Solo visible para administradores

### Página de Login
- Diseño moderno con gradiente de fondo
- Tarjeta centrada con sombra
- Campos de formulario con validación
- Mensajes de error claros
- Credenciales de prueba visibles
- Estado de carga durante el login

## 🧪 Probar el Sistema

### Caso 1: Acceso sin autenticación
1. Abre http://localhost:4200
2. Intenta acceder a http://localhost:4200/admin
3. Deberías ser redirigido a http://localhost:4200/login

### Caso 2: Login exitoso
1. Ve a http://localhost:4200/login
2. Ingresa las credenciales correctas
3. Deberías ser redirigido a http://localhost:4200/admin
4. El navbar debe mostrar "Admin" y "Cerrar Sesión"

### Caso 3: Login fallido
1. Ve a http://localhost:4200/login
2. Ingresa credenciales incorrectas
3. Deberías ver un mensaje de error
4. No deberías ser redirigido

### Caso 4: Cerrar sesión
1. Estando autenticado, haz clic en "Cerrar Sesión"
2. Deberías ser redirigido a http://localhost:4200/inicio
3. El navbar debe mostrar "Login" en lugar de "Admin"

## 📊 Flujo de Datos

```
Usuario → Login Component
    ↓
AuthService.login(email, password)
    ↓
HTTP POST → http://localhost:3000/api/auth/login
    ↓
Backend verifica credenciales
    ↓
Respuesta con token y datos de usuario
    ↓
AuthService guarda token en localStorage
    ↓
AuthService actualiza currentUser$ (Observable)
    ↓
AppComponent se suscribe y actualiza UI
    ↓
Navbar muestra/oculta menús según estado
```

## 🔄 Estado de Autenticación

El estado de autenticación se maneja con RxJS Observables:

```typescript
// En AuthService
private currentUserSubject = new BehaviorSubject<User | null>(null);
public currentUser$ = this.currentUserSubject.asObservable();

// En AppComponent
this.authService.currentUser$.subscribe(user => {
  this.currentUser = user;
  this.isAdmin = user?.role === 'admin';
});
```

Esto permite que cualquier componente se suscriba y reaccione a cambios en el estado de autenticación.

## 🎯 Próximos Pasos

El sistema de autenticación está completo. Ahora puedes:

1. **Mejorar el Panel de Admin** - Agregar más funcionalidades
2. **Agregar Más Roles** - Customer, Moderator, etc.
3. **Recuperación de Contraseña** - Implementar reset password
4. **Perfil de Usuario** - Página para editar datos del usuario
5. **Registro de Usuarios** - Permitir que nuevos usuarios se registren

¿Quieres que implemente alguna de estas funcionalidades?
