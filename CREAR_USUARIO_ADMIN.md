# 👤 Crear Usuario Administrador en Firebase

## 🔴 Problema:

```
Buscando usuario con email: admin@tiendaropa.com
Usuario encontrado: NO
```

Firebase está configurado correctamente, pero **no hay usuarios** en la base de datos.

---

## ✅ Solución: Crear Usuario Admin

He creado un script que inicializa un usuario administrador en Firebase.

### Paso 1: Ejecutar el Script

```bash
cd backend
npm run create-admin
```

### Resultado Esperado:

```
Creando usuario administrador...
✅ Usuario creado en Firebase Auth
✅ Usuario guardado en Firestore

📋 Credenciales del administrador:
Email: admin@tiendaropa.com
Password: admin123
UID: [ID generado por Firebase]

✅ Usuario administrador creado exitosamente
```

---

## 🧪 Probar el Login

### 1. Desde el Frontend:

1. Ve a `http://localhost:4200/login`
2. Ingresa:
   - **Email**: `admin@tiendaropa.com`
   - **Password**: `admin123`
3. Click en "Iniciar Sesión"
4. Deberías ser redirigido al panel de admin

### 2. Desde cURL:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@tiendaropa.com\",\"password\":\"admin123\"}"
```

**Respuesta esperada:**
```json
{
  "message": "Inicio de sesión exitoso",
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@tiendaropa.com",
    "firstName": "Admin",
    "lastName": "Sistema",
    "role": "admin"
  }
}
```

---

## 🔍 Verificar en Firebase Console:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: `react-firebase-dbc76`
3. **Authentication** → **Users**
   - Deberías ver: `admin@tiendaropa.com`
4. **Firestore Database** → **users** collection
   - Deberías ver un documento con el UID del usuario
   - Campos: `email`, `firstName`, `lastName`, `role: "admin"`

---

## 📝 Archivos Creados/Modificados:

### 1. Script de Creación (`backend/src/scripts/createAdminUser.js`)

```javascript
// Crea un usuario admin en Firebase Auth y Firestore
// Verifica si ya existe antes de crear
// Maneja errores de duplicados
```

### 2. Package.json Actualizado

Nuevo script agregado:
```json
"scripts": {
  "create-admin": "node src/scripts/createAdminUser.js"
}
```

### 3. Middleware de Auth Mejorado

Ahora acepta:
- ID tokens de Firebase (verificados)
- Custom tokens de Firebase (decodificados)
- Tokens mock (para desarrollo sin Firebase)

---

## ⚠️ Notas Importantes:

### Credenciales por Defecto:

```
Email: admin@tiendaropa.com
Password: admin123
```

**⚠️ IMPORTANTE**: Cambia la contraseña en producción.

### Cambiar Contraseña:

Puedes cambiar la contraseña desde Firebase Console:
1. Authentication → Users
2. Click en el usuario
3. Click en "Reset password"

O desde código:
```javascript
await auth.updateUser(userId, {
  password: 'nueva_contraseña_segura'
});
```

---

## 🆘 Troubleshooting:

### "Error: auth/email-already-exists"

**Causa**: El usuario ya existe en Firebase Auth pero no en Firestore.

**Solución**: El script lo maneja automáticamente, obteniendo el usuario existente y guardándolo en Firestore.

### "Usuario encontrado: NO" después de crear

**Causa**: El backend no se reinició después de crear el usuario.

**Solución**: 
1. Detén el backend (Ctrl+C)
2. Reinicia: `npm run dev`
3. Intenta login de nuevo

### "Error: Cannot find module './scripts/createAdminUser.js'"

**Causa**: Estás ejecutando el comando desde la carpeta incorrecta.

**Solución**:
```bash
cd backend
npm run create-admin
```

### "Firebase error: Permission denied"

**Causa**: Las credenciales de Firebase no tienen permisos suficientes.

**Solución**:
1. Ve a Firebase Console
2. Project Settings → Service Accounts
3. Descarga nuevas credenciales con permisos de admin
4. Reemplaza el archivo de credenciales

---

## 🔐 Crear Más Usuarios:

### Desde el Panel de Admin:

Una vez que tengas acceso como admin, puedes crear más usuarios desde:
- `http://localhost:4200/admin/usuarios` (si existe la ruta)

### Desde el Script:

Modifica `createAdminUser.js` para crear usuarios adicionales:

```javascript
// Crear usuario customer
const customerData = {
  email: 'cliente@ejemplo.com',
  password: 'cliente123',
  firstName: 'Cliente',
  lastName: 'Ejemplo',
  role: 'customer'
};

const userRecord = await auth.createUser({
  email: customerData.email,
  password: customerData.password,
  displayName: `${customerData.firstName} ${customerData.lastName}`
});

await usersCollection.doc(userRecord.uid).set({
  uid: userRecord.uid,
  ...customerData,
  password: undefined,
  createdAt: new Date(),
  updatedAt: new Date()
});
```

---

## ✅ Checklist de Verificación:

- [ ] Script ejecutado: `npm run create-admin`
- [ ] Usuario visible en Firebase Console → Authentication
- [ ] Usuario visible en Firebase Console → Firestore → users
- [ ] Login funciona desde el frontend
- [ ] Login funciona desde cURL
- [ ] Token se genera correctamente
- [ ] Puedes acceder al panel de admin
- [ ] Puedes crear/editar/eliminar productos

---

## 🎉 Resultado Final:

Después de ejecutar el script y hacer login:
- ✅ Usuario admin creado en Firebase
- ✅ Login funciona correctamente
- ✅ Token JWT generado
- ✅ Acceso al panel de administración
- ✅ CRUD de productos funciona

---

¡Usuario administrador creado! Ahora puedes iniciar sesión y gestionar la tienda. 🚀
