# 🚀 Conectar a Firebase AHORA - Guía Rápida

## ⚡ Opción 1: Script Automático (Recomendado)

```bash
cd backend
node setup-firebase.js
```

El script te guiará paso a paso para:
1. Descargar las credenciales de Firebase Console
2. Copiar el archivo a la ubicación correcta
3. Actualizar automáticamente el `.env`
4. Configurar `.gitignore`

## 📋 Opción 2: Manual (5 minutos)

### Paso 1: Obtener Credenciales
1. Abre: https://console.firebase.google.com/project/react-firebase-dbc76/settings/serviceaccounts/adminsdk
2. Haz clic en **"Generate new private key"**
3. Descarga el archivo JSON (ejemplo: `react-firebase-dbc76-firebase-adminsdk-xxxxx.json`)

### Paso 2: Configurar
Elige UNA de estas opciones:

**Opción A: Archivo JSON (Más Seguro)**
```bash
# 1. Copia el archivo descargado a la carpeta backend
# 2. Renómbralo a: firebase-credentials.json
# 3. Agrega al .env:
GOOGLE_APPLICATION_CREDENTIALS=./firebase-credentials.json
```

**Opción B: Variable de Entorno**
```bash
# 1. Abre el archivo JSON descargado
# 2. Copia TODO el contenido (una sola línea)
# 3. Agrega al .env:
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"react-firebase-dbc76",...todo el JSON...}
```

### Paso 3: Reiniciar Backend
```bash
# Detén el servidor actual (Ctrl+C en la terminal donde corre)
npm run dev
```

## ✅ Verificar que Funciona

Deberías ver en la consola:
```
✅ Firebase inicializado con credenciales de servicio.
✅ Servidor corriendo en http://localhost:3000
```

En lugar de:
```
❌ Credenciales de Firebase no encontradas. Usando almacenamiento local...
```

## 🧪 Probar la Conexión

```powershell
# Crear un producto de prueba
Invoke-WebRequest -Uri http://localhost:3000/api/products/seed -Method POST -UseBasicParsing

# Ver productos (ahora desde Firebase Firestore)
Invoke-WebRequest -Uri http://localhost:3000/api/products -UseBasicParsing
```

## 🔍 Ver los Datos en Firebase

1. Ve a: https://console.firebase.google.com/project/react-firebase-dbc76/firestore
2. Deberías ver la colección **"products"** con tus productos

## ❓ Problemas Comunes

### "No se pudo parsear FIREBASE_SERVICE_ACCOUNT"
- Asegúrate de que el JSON esté en UNA SOLA LÍNEA
- No debe tener saltos de línea dentro del valor

### "La ruta no existe"
- Verifica que la ruta sea relativa a la carpeta `backend/`
- Usa `./firebase-credentials.json` (con el punto al inicio)

### "Firebase no inicializado"
- Verifica que el archivo `.env` tenga la variable correcta
- Reinicia el servidor después de cambiar `.env`

## 🎯 Resultado Final

Una vez configurado:
- ✅ Backend conectado a Firebase Firestore (nube)
- ✅ Datos persistentes en la nube
- ✅ Accesibles desde cualquier lugar
- ✅ No más almacenamiento local `.local-data/`
