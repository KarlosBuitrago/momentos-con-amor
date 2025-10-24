# 📸 Guía Visual: Habilitar Firebase Authentication

## 🎯 Objetivo:

Habilitar Firebase Authentication para que tu aplicación use autenticación real con contraseñas.

---

## 📋 Paso a Paso con Referencias Visuales:

### Paso 1: Acceder a Firebase Console

1. **URL**: https://console.firebase.google.com/
2. **Proyecto**: react-firebase-dbc76

**Lo que verás:**
- Dashboard principal de Firebase
- Lista de servicios en el menú lateral

---

### Paso 2: Ir a Authentication

**En el menú lateral izquierdo:**
- Busca el ícono de una persona con un candado
- Texto: "Authentication"
- Click ahí

**Si es la primera vez:**
- Verás un botón grande: "Get started" o "Comenzar"
- Click en ese botón

**Si ya está habilitado:**
- Verás pestañas: Users, Sign-in method, Templates, Usage

---

### Paso 3: Habilitar Email/Password

**En la pestaña "Sign-in method":**

1. Verás una lista de proveedores:
   ```
   Email/Password          [Disabled]  >
   Phone                   [Disabled]  >
   Google                  [Disabled]  >
   ...
   ```

2. Click en **"Email/Password"** (primera opción)

3. Se abre un modal/panel:
   ```
   Email/Password
   
   [ ] Enable
   
   Email link (passwordless sign-in)
   [ ] Enable
   
   [Cancel]  [Save]
   ```

4. Activa el primer switch: **"Enable"**
   - NO actives "Email link" por ahora

5. Click en **"Save"**

6. Ahora debe mostrar:
   ```
   Email/Password          [Enabled]   >
   ```

---

### Paso 4: Verificar que Está Habilitado

**Señales de éxito:**

1. En "Sign-in method":
   - Email/Password muestra **"Enabled"** en verde

2. En la pestaña "Users":
   - Verás una tabla vacía (por ahora)
   - Botón "Add user" disponible

---

## ✅ Listo!

Firebase Authentication está habilitado correctamente.

---

## 🚀 Siguiente Paso:

Ejecuta el script para crear el usuario admin:

```bash
cd backend
npm run create-admin
```

Ver: **PASO_2_CREAR_USUARIO.md**

---

## 🆘 Troubleshooting:

### No veo "Authentication" en el menú

**Solución:**
- Scroll down en el menú lateral
- Está en la sección "Build" o "Compilación"
- Ícono: persona con candado

### No veo el botón "Get started"

**Posibles causas:**
1. Ya está habilitado → Ve a "Sign-in method"
2. No tienes permisos → Verifica que seas owner del proyecto

### El switch no se activa

**Solución:**
- Refresca la página
- Verifica tu conexión a internet
- Intenta desde otro navegador

---

## 📝 Resumen:

1. ✅ Firebase Console → Authentication
2. ✅ Get started (si es primera vez)
3. ✅ Sign-in method → Email/Password
4. ✅ Enable → Save
5. ✅ Verificar que muestra "Enabled"

---

¡Firebase Authentication habilitado! 🎉
