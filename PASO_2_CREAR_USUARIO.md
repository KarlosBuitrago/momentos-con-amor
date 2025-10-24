# 👤 Paso 2: Crear Usuario Administrador

## ⚠️ Requisito:

Debes haber completado **PASO_1_HABILITAR_AUTH.md** primero.

---

## 🚀 Ejecutar Script:

```bash
cd backend
npm run create-admin
```

---

## ✅ Resultado Esperado:

```
Firebase inicializado con credenciales de servicio.
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

## 🔍 Verificar en Firebase Console:

### 1. Verificar en Authentication:

1. Ve a Firebase Console → **Authentication** → **Users**
2. Deberías ver: `admin@tiendaropa.com`
3. Estado: **Enabled**

### 2. Verificar en Firestore:

1. Ve a Firebase Console → **Firestore Database**
2. Busca la colección **users**
3. Deberías ver un documento con el UID del usuario
4. Campos:
   - `email`: admin@tiendaropa.com
   - `firstName`: Admin
   - `lastName`: Sistema
   - `role`: admin

---

## 🆘 Si Hay Error:

### Error: "auth/configuration-not-found"

**Causa**: Firebase Auth no está habilitado.

**Solución**: Vuelve a **PASO_1_HABILITAR_AUTH.md**

### Error: "auth/email-already-exists"

**Causa**: El usuario ya existe.

**Solución**: El script lo maneja automáticamente. Si ves este error pero el script continúa, está bien.

---

## ✅ Listo!

Usuario administrador creado con Firebase Authentication.

**Siguiente paso**: Ejecuta `PASO_3_PROBAR_LOGIN.md`
