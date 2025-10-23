# Configuración de Firebase

## Problema Actual
El backend está usando almacenamiento local mock (`.local-data/`) porque no encuentra credenciales de Firebase.

## Solución: Obtener Credenciales de Service Account

### Opción 1: Usar Firebase Console (Recomendado)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: `react-firebase-dbc76`
3. Ve a **Project Settings** (⚙️ icono en la parte superior izquierda)
4. Ve a la pestaña **Service Accounts**
5. Haz clic en **Generate New Private Key**
6. Se descargará un archivo JSON

### Opción 2: Configurar las Credenciales

**Método A: Archivo JSON (Más seguro)**

1. Guarda el archivo descargado como `backend/firebase-credentials.json`
2. Agrega esta línea al archivo `.env`:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=./firebase-credentials.json
   ```
3. Asegúrate de que `firebase-credentials.json` esté en `.gitignore`

**Método B: Variable de Entorno (Alternativa)**

1. Abre el archivo JSON descargado
2. Copia todo el contenido (debe ser una línea)
3. Agrega al archivo `.env`:
   ```
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"react-firebase-dbc76",...todo el JSON...}
   ```

## Verificar que Funciona

1. Reinicia el servidor backend:
   ```bash
   npm run dev
   ```

2. Deberías ver en la consola:
   ```
   Firebase inicializado con credenciales de servicio.
   ```

3. En lugar de:
   ```
   Credenciales de Firebase no encontradas. Usando almacenamiento local en disco (.local-data).
   ```

## Modo de Desarrollo Local (Sin Firebase)

Si prefieres trabajar sin Firebase por ahora, el sistema de mock storage funciona perfectamente:
- Los datos se guardan en `.local-data/`
- Es útil para desarrollo sin conexión
- No requiere configuración adicional

## Poblar la Base de Datos

Una vez configurado Firebase, puedes poblar productos de ejemplo:

```bash
# Usando curl
curl -X POST http://localhost:3000/api/products/seed

# O usando PowerShell
Invoke-WebRequest -Uri http://localhost:3000/api/products/seed -Method POST
```
