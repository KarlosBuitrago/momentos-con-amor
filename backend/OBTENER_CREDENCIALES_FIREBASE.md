# 🔑 Cómo Obtener Credenciales de Firebase Service Account

## ⚠️ Importante
Las credenciales que tienes en `.env` son para el **cliente web** (frontend).
El backend necesita credenciales de **Service Account** (servidor).

## 📋 Pasos para Obtener las Credenciales

### 1. Ve a Firebase Console
Abre: https://console.firebase.google.com/project/react-firebase-dbc76/settings/serviceaccounts/adminsdk

### 2. Genera una Nueva Clave Privada
1. En la pestaña **"Service accounts"**
2. Haz clic en **"Generate new private key"**
3. Confirma haciendo clic en **"Generate key"**
4. Se descargará un archivo JSON (ejemplo: `react-firebase-dbc76-firebase-adminsdk-xxxxx.json`)

### 3. Configura las Credenciales

**Opción A: Archivo JSON (Más Seguro)**
1. Copia el archivo descargado a la carpeta `backend/`
2. Renómbralo a `firebase-credentials.json`
3. Agrega al `.env`:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=./firebase-credentials.json
   ```
4. Asegúrate de agregar a `.gitignore`:
   ```
   firebase-credentials.json
   ```

**Opción B: Variable de Entorno (Alternativa)**
1. Abre el archivo JSON descargado
2. Copia TODO el contenido (debe ser una sola línea)
3. Agrega al `.env`:
   ```
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"react-firebase-dbc76","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxxxx@react-firebase-dbc76.iam.gserviceaccount.com",...}
   ```

### 4. Reinicia el Backend
```bash
# Detén el servidor actual (Ctrl+C)
npm run dev
```

Deberías ver:
```
Firebase inicializado con credenciales de servicio.
Servidor corriendo en http://localhost:3000
```

## 🔍 Verificar que Funciona

```powershell
# Verificar productos
Invoke-WebRequest -Uri http://localhost:3000/api/products -UseBasicParsing
```

Los productos ahora se guardarán en **Firebase Firestore** (en la nube), no en `.local-data/`.

## ❓ ¿Por qué necesito esto?

- **Frontend (Angular)**: Usa `FIREBASE_API_KEY` para autenticación de usuarios
- **Backend (Node.js)**: Usa **Service Account** para acceso administrativo a Firestore

Son dos tipos diferentes de credenciales para diferentes propósitos.
