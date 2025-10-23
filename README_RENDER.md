# Despliegue Rápido en Render

## Resumen de Archivos Creados

✅ **Backend**:
- `backend/Dockerfile` - Configuración Docker para el backend
- `backend/.dockerignore` - Archivos a ignorar en Docker
- `backend/.env.example` - Ejemplo de variables de entorno

✅ **Frontend**:
- `frontend/tienda-ropa/Dockerfile` - Configuración Docker para el frontend
- `frontend/tienda-ropa/.dockerignore` - Archivos a ignorar en Docker
- `frontend/tienda-ropa/nginx.conf` - Configuración de Nginx
- `frontend/tienda-ropa/src/environments/environment.prod.ts` - Variables de producción

✅ **Configuración General**:
- `render.yaml` - Configuración Blueprint para Render
- `DEPLOY_INSTRUCTIONS.md` - Guía detallada de despliegue
- `.gitignore` - Archivos a ignorar en Git

## Pasos Rápidos

### 1. Preparar Repositorio
```bash
git add .
git commit -m "Configurar para despliegue en Render"
git push origin main
```

### 2. Desplegar Backend
1. Ir a [Render Dashboard](https://dashboard.render.com/)
2. New + → Web Service
3. Conectar repositorio
4. Configurar:
   - Environment: **Docker**
   - Dockerfile Path: `./backend/Dockerfile`
   - Docker Context: `./backend`
5. Agregar variables de entorno:
   - `NODE_ENV=production`
   - `PORT=3000`
   - `FIREBASE_PROJECT_ID=react-firebase-dbc76`
6. Agregar Secret File:
   - Filename: `/app/firebase-credentials.json`
   - Content: Tu archivo de credenciales Firebase
7. Deploy

### 3. Desplegar Frontend
1. New + → Web Service
2. Conectar mismo repositorio
3. Configurar:
   - Environment: **Docker**
   - Dockerfile Path: `./frontend/tienda-ropa/Dockerfile`
   - Docker Context: `./frontend/tienda-ropa`
4. Deploy

### 4. Actualizar URLs
Después de que ambos servicios estén desplegados:

1. Copia la URL del backend (ej: `https://tienda-ropa-backend.onrender.com`)
2. Actualiza `frontend/tienda-ropa/src/environments/environment.prod.ts`:
   ```typescript
   apiUrl: 'https://TU-BACKEND-URL.onrender.com/api'
   ```
3. Actualiza CORS en `backend/src/index.js`:
   ```javascript
   app.use(cors({
     origin: ['https://TU-FRONTEND-URL.onrender.com']
   }));
   ```
4. Commit y push:
   ```bash
   git add .
   git commit -m "Actualizar URLs de producción"
   git push
   ```

## URLs de Ejemplo

Después del despliegue tendrás:
- **Backend**: `https://tienda-ropa-backend.onrender.com`
- **Frontend**: `https://tienda-ropa-frontend.onrender.com`

## Importante

⚠️ **Plan Gratuito**: Los servicios se duermen después de 15 min de inactividad. El primer request tarda ~30 seg.

⚠️ **Credenciales Firebase**: NO subas el archivo de credenciales al repositorio. Usa Secret Files en Render.

⚠️ **Variables de Entorno**: Actualiza las URLs después del primer despliegue.

## Soporte

Para más detalles, consulta `DEPLOY_INSTRUCTIONS.md`
