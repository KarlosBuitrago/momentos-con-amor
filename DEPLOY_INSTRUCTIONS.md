# Guía de Despliegue en Render

## Preparación

### 1. Repositorio Git
Asegúrate de que tu proyecto esté en un repositorio Git (GitHub, GitLab, o Bitbucket).

```bash
git init
git add .
git commit -m "Preparar proyecto para despliegue en Render"
git remote add origin <tu-repositorio-url>
git push -u origin main
```

### 2. Credenciales de Firebase
Necesitarás subir tu archivo de credenciales de Firebase como un **Secret File** en Render.

## Despliegue del Backend

### Opción A: Usando Dockerfile (Recomendado)

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu repositorio
4. Configura:
   - **Name**: `tienda-ropa-backend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `./backend/Dockerfile`
   - **Docker Context**: `./backend`
   - **Instance Type**: `Free`

5. **Variables de Entorno**:
   ```
   NODE_ENV=production
   PORT=3000
   FIREBASE_PROJECT_ID=react-firebase-dbc76
   ```

6. **Secret Files**:
   - Click en **"Add Secret File"**
   - **Filename**: `/app/firebase-credentials.json`
   - **Contents**: Pega el contenido de tu archivo `react-firebase-dbc76-firebase-adminsdk-z2n37-911e39435e.json`

7. Click en **"Create Web Service"**

### Opción B: Sin Docker (Detección automática)

1. Mismo proceso pero selecciona **"Node"** como Environment
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`
4. **Root Directory**: `backend`

## Despliegue del Frontend

### Opción A: Usando Dockerfile (Recomendado)

1. **"New +"** → **"Web Service"**
2. Conecta el mismo repositorio
3. Configura:
   - **Name**: `tienda-ropa-frontend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `./frontend/tienda-ropa/Dockerfile`
   - **Docker Context**: `./frontend/tienda-ropa`
   - **Instance Type**: `Free`

4. **Variables de Entorno**:
   ```
   API_URL=https://tienda-ropa-backend.onrender.com
   ```
   (Reemplaza con la URL real de tu backend después de desplegarlo)

5. Click en **"Create Web Service"**

### Opción B: Static Site (Más económico)

1. **"New +"** → **"Static Site"**
2. Configura:
   - **Name**: `tienda-ropa-frontend`
   - **Build Command**: `cd frontend/tienda-ropa && npm install && npm run build`
   - **Publish Directory**: `frontend/tienda-ropa/dist/tienda-ropa/browser`

## Configuración Post-Despliegue

### 1. Actualizar URLs en el Frontend

Edita `frontend/tienda-ropa/src/environments/environment.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tienda-ropa-backend.onrender.com/api'
};
```

### 2. Configurar CORS en el Backend

Edita `backend/src/index.js` para permitir tu dominio de frontend:

```javascript
app.use(cors({
  origin: [
    'https://tienda-ropa-frontend.onrender.com',
    'http://localhost:4200'
  ],
  credentials: true
}));
```

### 3. Re-desplegar

Haz commit y push de los cambios:

```bash
git add .
git commit -m "Actualizar URLs para producción"
git push
```

Render automáticamente re-desplegará tus servicios.

## Usando render.yaml (Despliegue Automático)

Si prefieres usar el archivo `render.yaml` incluido:

1. Ve a **"New +"** → **"Blueprint"**
2. Conecta tu repositorio
3. Render detectará automáticamente el `render.yaml`
4. Configura las variables de entorno y secret files
5. Click en **"Apply"**

## Notas Importantes

### Plan Gratuito de Render
- Los servicios gratuitos se "duermen" después de 15 minutos de inactividad
- El primer request después de dormir tarda ~30 segundos en responder
- 750 horas/mes de uso gratuito por servicio

### Monitoreo
- Puedes ver los logs en tiempo real desde el dashboard de Render
- Configura notificaciones para errores de despliegue

### Dominios Personalizados
- Render proporciona subdominios `.onrender.com` gratis
- Puedes agregar tu propio dominio en la configuración del servicio

## Solución de Problemas

### Error: "Cannot find module"
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que `npm install` se ejecute correctamente

### Error de Firebase
- Verifica que el Secret File esté correctamente configurado
- Confirma que la variable `GOOGLE_APPLICATION_CREDENTIALS` apunte a `/app/firebase-credentials.json`

### CORS Errors
- Actualiza la configuración de CORS en el backend con la URL correcta del frontend
- Verifica que las URLs no tengan barras finales (`/`)

### Build Failures
- Revisa los logs de build en Render
- Verifica que los Dockerfiles estén en las rutas correctas
- Confirma que los comandos de build funcionen localmente

## Comandos Útiles

### Probar Dockerfiles localmente

Backend:
```bash
cd backend
docker build -t tienda-backend .
docker run -p 3000:3000 --env-file .env tienda-backend
```

Frontend:
```bash
cd frontend/tienda-ropa
docker build -t tienda-frontend .
docker run -p 80:80 tienda-frontend
```

## Recursos

- [Documentación de Render](https://render.com/docs)
- [Render Community](https://community.render.com/)
- [Render Status](https://status.render.com/)
