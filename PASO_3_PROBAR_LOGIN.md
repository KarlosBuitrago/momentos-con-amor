# 🧪 Paso 3: Probar Login y CRUD

## ⚠️ Requisitos:

1. ✅ Firebase Auth habilitado (PASO_1)
2. ✅ Usuario admin creado (PASO_2)
3. ✅ Backend corriendo (`npm run dev`)

---

## 🚀 Pasos:

### 1. Limpiar localStorage:

Abre `http://localhost:4200` y ejecuta en la consola:

```javascript
localStorage.clear();
location.reload();
```

### 2. Probar Login:

1. Ve a: `http://localhost:4200/login`
2. Ingresa:
   - **Email**: `admin@tiendaropa.com`
   - **Password**: `admin123`
3. Click en **"Iniciar Sesión"**
4. ✅ Deberías ser redirigido a `/admin`

### 3. Verificar Token:

En la consola del navegador:

```javascript
localStorage.getItem('auth_token')
// Debe mostrar un token largo (JWT)
```

### 4. Probar CRUD de Productos:

En `http://localhost:4200/admin`:

#### Crear Producto:
1. Click en **"Agregar producto"**
2. Llena el formulario:
   - Nombre: "Producto de Prueba"
   - Descripción: "Test"
   - Precio: 10000
   - Categoría: Muñecos
   - Stock: 5
3. Click en **"Guardar"**
4. ✅ Debe aparecer en la lista

#### Editar Producto:
1. Click en **"Editar"** en el producto
2. Cambia el nombre
3. Click en **"Guardar"**
4. ✅ Debe actualizarse

#### Eliminar Producto:
1. Click en **"Eliminar"** en el producto
2. Confirma la eliminación
3. ✅ Debe desaparecer de la lista

---

## 🔍 Verificar en Firebase Console:

1. Ve a **Firestore Database** → **products**
2. Deberías ver los productos que creaste
3. Los cambios deben reflejarse en tiempo real

---

## ✅ Todo Funciona!

Si todos los pasos funcionaron:
- ✅ Firebase Auth configurado correctamente
- ✅ Usuario admin con contraseña real
- ✅ Login con validación de contraseña
- ✅ Tokens JWT seguros
- ✅ CRUD completo funcionando

---

## 🎉 Siguiente Paso:

Tu aplicación está lista para desarrollo y producción.

**Opcional**: Lee `DEPLOYMENT_FINAL.md` para desplegar en Render.
