# 🚀 Guía de Deployment GRATIS en Render - Momentos con Amor

## 📋 Resumen del Proyecto

**Momentos con Amor** - Tienda online de ropa

- **Backend**: Node.js + Express + Firebase Firestore (Puerto 3000)
- **Frontend**: Angular 19 con SSR (Puerto 4000)
- **Base de datos**: Firebase Firestore (react-firebase-dbc76)

---

## ✅ Pre-requisitos

1. **Cuenta GRATIS en Render**: [render.com](https://render.com)
2. **Repositorio Git**: Tu código debe estar en GitHub/GitLab/Bitbucket
3. **Archivo de credenciales Firebase**: `react-firebase-dbc76-firebase-adminsdk-z2n37-911e39435e.json`

---

## 🎯 Deployment Manual 100% GRATIS

### Paso 1: Subir código a Git

```bash
git add .
git commit -m "Preparar para deployment en Render"
git push origin main
```

### Paso 2: Desplegar Backend (GRATIS)

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub/GitLab
4. Configura:
   - **Name**: `tienda-ropa-backend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `./backend/Dockerfile`
   - **Docker Context**: `./backend`
   - **Instance Type**: `Free` ⭐ (IMPORTANTE: Selecciona FREE)

5. **Variables de Entorno** (Add Environment Variable):

   ```
   NODE_ENV = production
   FIREBASE_PROJECT_ID = react-firebase-dbc76
   GOOGLE_APPLICATION_CREDENTIALS = /app/react-firebase-dbc76-firebase-adminsdk-z2n37-911e39435e.json
   ```

6. Click en **"Create Web Service"**

### Paso 3: Configurar Secret File para Firebase (GRATIS)

1. Espera a que el backend termine de desplegarse (5-10 minutos)
2. Ve al servicio `tienda-ropa-backend` en tu dashboard
3. Click en **"Environment"** en el menú lateral
4. Scroll hasta **"Secret Files"**
5. Click en **"Add Secret File"**
6. Configura:
   - **Filename**: `/app/react-firebase-dbc76-firebase-adminsdk-z2n37-911e39435e.json`
   - **Contents**: Copia y pega TODO el contenido de tu archivo de credenciales Firebase
7. Click en **"Save Changes"**
8. El servicio se re-desplegará automáticamente

### Paso 4: Copiar URL del Backend

1. En el dashboard del backend, copia la URL (algo como `https://tienda-ropa-backend.onrender.com`)
2. Guárdala, la necesitarás para el frontend

### Paso 5: Desplegar Frontend (GRATIS)

1. Click en **"New +"** → **"Web Service"**
2. Conecta el mismo repositorio
3. Configura:
   - **Name**: `tienda-ropa-frontend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `./frontend/tienda-ropa/Dockerfile`
   - **Docker Context**: `./frontend/tienda-ropa`
   - **Instance Type**: `Free` ⭐ (IMPORTANTE: Selecciona FREE)

4. **Variables de Entorno** (Add Environment Variable):

   ```
   NODE_ENV = production
   API_URL = https://tienda-ropa-backend.onrender.com
   ```

   ⚠️ Reemplaza con la URL real de tu backend del Paso 4

5. Click en **"Create Web Service"**

### Paso 6: Verificar Deployment

- **Backend**: `https://tienda-ropa-backend.onrender.com`
- **Frontend**: `https://tienda-ropa-frontend.onrender.com`

Espera 5-10 minutos para el primer deployment del frontend.

---

## 🔄 Actualizar URLs de Producción

### 1. Actualizar Frontend Environment

Edita `frontend/tienda-ropa/src/environments/environment.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tienda-ropa-backend.onrender.com/api'
};
```

### 2. Actualizar CORS en Backend

Edita `backend/src/index.js`:

```javascript
app.use(cors({
  origin: [
    'https://tienda-ropa-frontend.onrender.com',
    'http://localhost:4200',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

### 3. Commit y Push

```bash
git add .
git commit -m "Actualizar URLs para producción"
git push
```

Render re-desplegará automáticamente.

---

## 🧪 Probar Dockerfiles Localmente

### Backend

```bash
cd backend
docker build -t tienda-backend .
docker run -p 3000:3000 --env-file .env tienda-backend
```

Prueba: `http://localhost:3000`

### Frontend

```bash
cd frontend/tienda-ropa
docker build -t tienda-frontend .
docker run -p 4000:4000 tienda-frontend
```

Prueba: `http://localhost:4000`

---

## ⚠️ Problemas Comunes

### 1. Error: "npm ci can only install with an existing package-lock.json"

**Solución**: Ya está arreglado en el Dockerfile. Si persiste:

```bash
cd backend
npm install
git add package-lock.json
git commit -m "Agregar package-lock.json"
git push
```

### 2. Error: "Cannot find module firebase-admin"

**Solución**: Verifica que `firebase-admin` esté en `backend/package.json` dependencies

### 3. Error: "GOOGLE_APPLICATION_CREDENTIALS not found"

**Solución**:

- Verifica que el Secret File esté configurado correctamente
- El path debe ser exactamente: `/app/react-firebase-dbc76-firebase-adminsdk-z2n37-911e39435e.json`

### 4. CORS Errors en el Frontend

**Solución**:

- Actualiza la configuración de CORS en `backend/src/index.js`
- Agrega la URL de tu frontend de Render

### 5. Build Failure en Frontend

**Solución**:

- Verifica que `npm run build` funcione localmente
- Revisa los logs de build en Render

### 6. Servicio "dormido" (Plan Free)

**Comportamiento normal**: Los servicios gratuitos se duermen después de 15 minutos de inactividad

- El primer request tarda ~30 segundos en responder
- Considera usar un servicio de "ping" para mantenerlo activo

---

## 📊 Monitoreo

### Ver Logs en Tiempo Real

1. Ve a tu servicio en Render Dashboard
2. Click en **"Logs"** en el menú lateral
3. Verás los logs en tiempo real

### Verificar Estado

- **Backend Health Check**: `https://tienda-ropa-backend.onrender.com/`
- **Frontend**: `https://tienda-ropa-frontend.onrender.com/`

---

## 💰 Plan Gratuito de Render (100% GRATIS)

- ✅ **GRATIS para siempre** - No necesitas tarjeta de crédito
- ✅ 750 horas/mes por servicio (suficiente para uso normal)
- ✅ Subdominios `.onrender.com` gratis
- ✅ SSL automático (HTTPS)
- ✅ 2 servicios web gratis (Backend + Frontend)
- ⚠️ Los servicios se duermen después de 15 min de inactividad
- ⚠️ Límite de 512 MB RAM por servicio
- ⚠️ Build time: máximo 15 minutos

**Nota**: NO uses Blueprint, ahora pide tarjeta de crédito. Usa el método manual que es 100% gratis.

---

## 🔗 Recursos Útiles

- [Documentación de Render](https://render.com/docs)
- [Render Community](https://community.render.com/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

## 💡 Servicios para Mantener Activo (Opcional)

Para evitar que tus servicios se duerman, usa un ping gratuito:

- **[UptimeRobot](https://uptimerobot.com)** - Gratis, 50 monitores
- **[Cron-job.org](https://cron-job.org)** - Gratis, ilimitado

Configura un ping cada 10 minutos a:

- `https://tienda-ropa-backend.onrender.com/`
- `https://tienda-ropa-frontend.onrender.com/`

---

## ✨ Checklist Final

- [ ] Código subido a Git
- [ ] Backend desplegado en Render (método manual)
- [ ] Secret File de Firebase configurado
- [ ] Frontend desplegado en Render (método manual)
- [ ] URLs actualizadas en el código
- [ ] CORS configurado correctamente
- [ ] Ambos servicios desplegados exitosamente
- [ ] Backend responde en `/api/products`
- [ ] Frontend carga correctamente
- [ ] Login de admin funciona
- [ ] Productos se cargan desde Firebase

---

¡Listo! Tu tienda **Momentos con Amor** está en producción 🎉
