# ✅ Solución: Problemas con CRUD de Productos

## 🔴 Problema Identificado:

No se pueden **crear, actualizar ni eliminar** productos desde el panel de administración.

### Causa Raíz:

El backend requiere **autenticación con token JWT** para las operaciones de escritura (POST, PUT, DELETE), pero el frontend **NO estaba enviando el token** en las peticiones HTTP.

```javascript
// backend/src/routes/productRoutes.js
router.post('/', requireAdmin, productController.createProduct);      // ❌ Requiere token
router.put('/:id', requireAdmin, productController.updateProduct);    // ❌ Requiere token
router.delete('/:id', requireAdmin, productController.deleteProduct); // ❌ Requiere token
```

Sin el token, el backend responde con **401 Unauthorized** y las operaciones fallan.

---

## ✅ Solución Implementada:

He creado un **HTTP Interceptor** que automáticamente agrega el token de autenticación a todas las peticiones al backend.

### Archivos Creados/Modificados:

#### 1. **Nuevo Interceptor** (`frontend/tienda-ropa/src/app/interceptors/auth.interceptor.ts`)

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Si hay token y la petición es al backend, agregar el header Authorization
  if (token && req.url.includes('/api/')) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};
```

#### 2. **Configuración Actualizada** (`frontend/tienda-ropa/src/app/app.config.ts`)

```typescript
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])  // ← Interceptor registrado
    ),
  ]
};
```

---

## 🎯 Cómo Funciona:

### Flujo Completo:

1. **Usuario hace login** → AuthService guarda el token en localStorage
2. **Usuario intenta eliminar un producto** → ProductService hace DELETE request
3. **Interceptor detecta la petición** → Agrega header `Authorization: Bearer <token>`
4. **Backend recibe el token** → Middleware `requireAdmin` valida el token
5. **Si es válido y es admin** → Permite la operación
6. **Si no es válido** → Responde 401 Unauthorized

### Antes (❌ Fallaba):

```
Frontend DELETE /api/products/123
  ↓
Backend: ❌ 401 Unauthorized (sin token)
```

### Ahora (✅ Funciona):

```
Frontend DELETE /api/products/123
  ↓
Interceptor: Agrega "Authorization: Bearer eyJhbGc..."
  ↓
Backend: ✅ 200 OK (token válido, usuario es admin)
```

---

## 🚀 Próximos Pasos:

### 1️⃣ Hacer Commit y Push:

```bash
git add frontend/tienda-ropa/src/app/interceptors/auth.interceptor.ts
git add frontend/tienda-ropa/src/app/app.config.ts
git commit -m "Fix: Agregar interceptor de autenticación para CRUD de productos"
git push
```

### 2️⃣ Probar Localmente:

1. **Inicia el backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Inicia el frontend**:
   ```bash
   cd frontend/tienda-ropa
   npm start
   ```

3. **Prueba el flujo completo**:
   - Ve a `http://localhost:4200/login`
   - Inicia sesión con usuario admin
   - Ve a `http://localhost:4200/admin`
   - Intenta **crear, editar o eliminar** un producto
   - Debería funcionar correctamente

### 3️⃣ Re-desplegar en Render:

Una vez que confirmes que funciona localmente:

1. **Frontend**: Manual Deploy → Deploy latest commit
2. Espera 5-7 minutos
3. Prueba en producción

---

## 🔍 Verificación:

### Cómo Verificar que Funciona:

1. **Abre las DevTools del navegador** (F12)
2. Ve a la pestaña **Network**
3. Intenta eliminar un producto
4. Busca la petición DELETE a `/api/products/...`
5. Verifica que tenga el header:
   ```
   Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6...
   ```

### Señales de Éxito:

- ✅ Puedes **crear** productos nuevos
- ✅ Puedes **editar** productos existentes
- ✅ Puedes **eliminar** productos
- ✅ Los cambios se reflejan inmediatamente
- ✅ No hay errores 401 en la consola

---

## ⚠️ Notas Importantes:

### Requisitos para que Funcione:

1. **Usuario debe estar autenticado** (haber hecho login)
2. **Usuario debe tener rol "admin"** (verificado en el backend)
3. **Token debe ser válido** (no expirado)

### Si Aún Falla:

1. **Verifica que estés logueado como admin**:
   ```typescript
   // En la consola del navegador:
   localStorage.getItem('auth_token')  // Debe mostrar un token
   localStorage.getItem('current_user') // Debe mostrar role: "admin"
   ```

2. **Verifica que el backend esté corriendo**:
   ```bash
   curl http://localhost:3000/api/products
   ```

3. **Revisa los logs del backend** para ver errores de autenticación

4. **Verifica las credenciales de Firebase** en el backend

---

## 📋 Checklist de Verificación:

- [ ] Interceptor creado en `interceptors/auth.interceptor.ts`
- [ ] Interceptor registrado en `app.config.ts`
- [ ] Commit y push realizados
- [ ] Probado localmente con éxito
- [ ] Backend corriendo y conectado a Firebase
- [ ] Usuario admin puede crear productos
- [ ] Usuario admin puede editar productos
- [ ] Usuario admin puede eliminar productos
- [ ] Re-desplegado en Render (si aplica)

---

¡El problema está solucionado! Ahora el frontend envía el token de autenticación automáticamente en todas las peticiones al backend.
