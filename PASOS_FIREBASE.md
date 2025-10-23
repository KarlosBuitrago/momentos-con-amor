# 🔥 CONECTAR A FIREBASE - PASOS EXACTOS

## 📍 ESTÁS AQUÍ
Tu backend está corriendo con almacenamiento local.
Necesitas conectarlo a Firebase Firestore (nube).

## 🎯 LO QUE NECESITAS HACER (5 minutos)

### 1️⃣ Obtener Credenciales de Firebase

Acabo de abrir Firebase Console en tu navegador.

Si no se abrió, ve a:
👉 https://console.firebase.google.com/project/react-firebase-dbc76/settings/serviceaccounts/adminsdk

En esa página:
1. Busca el botón **"Generate new private key"** (Generar nueva clave privada)
2. Haz clic en él
3. Confirma en el diálogo que aparece
4. Se descargará un archivo JSON (ejemplo: `react-firebase-dbc76-firebase-adminsdk-abc123.json`)

### 2️⃣ Configurar las Credenciales

**OPCIÓN FÁCIL - Usa el script automático:**

```bash
cd backend
node setup-firebase.js
```

El script te pedirá la ruta del archivo descargado y lo configurará todo automáticamente.

**OPCIÓN MANUAL:**

1. Copia el archivo descargado a la carpeta `backend/`
2. Renómbralo a: `firebase-credentials.json`
3. Abre `backend/.env` y agrega esta línea:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=./firebase-credentials.json
   ```

### 3️⃣ Reiniciar el Backend

En la terminal donde corre el backend:
- Presiona `Ctrl+C` para detenerlo
- Ejecuta: `npm run dev`

Deberías ver:
```
✅ Firebase inicializado con credenciales de servicio.
✅ Servidor corriendo en http://localhost:3000
```

### 4️⃣ Verificar que Funciona

```powershell
# Poblar productos en Firebase
Invoke-WebRequest -Uri http://localhost:3000/api/products/seed -Method POST -UseBasicParsing

# Ver productos desde Firebase
Invoke-WebRequest -Uri http://localhost:3000/api/products -UseBasicParsing
```

### 5️⃣ Ver los Datos en Firebase Console

Ve a: https://console.firebase.google.com/project/react-firebase-dbc76/firestore

Deberías ver la colección **"products"** con tus productos.

## 🎉 ¡LISTO!

Ahora tu backend está conectado a Firebase Firestore en la nube.
Los datos se guardan en Firebase, no en `.local-data/`.

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas, dime en qué paso estás y te ayudo.

Los archivos de ayuda están en:
- `backend/CONECTAR_FIREBASE_AHORA.md` - Guía detallada
- `backend/setup-firebase.js` - Script automático
- `backend/OBTENER_CREDENCIALES_FIREBASE.md` - Explicación completa
