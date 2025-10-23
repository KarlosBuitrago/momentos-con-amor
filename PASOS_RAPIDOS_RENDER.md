# 🚀 Pasos Rápidos - Deployment GRATIS en Render

## ⚡ Resumen Ultra Rápido (15 minutos)

### 1️⃣ Sube tu código a GitHub
```bash
git add .
git commit -m "Listo para Render"
git push origin main
```

---

### 2️⃣ Despliega el BACKEND (5 min)

1. Ve a [render.com](https://render.com) → **New +** → **Web Service**
2. Conecta tu repositorio
3. Configura:
   ```
   Name: tienda-ropa-backend
   Environment: Docker
   Dockerfile Path: ./backend/Dockerfile
   Docker Context: ./backend
   Instance Type: Free ⭐
   ```

4. Agrega estas variables (Add Environment Variable):
   ```
   NODE_ENV = production
   FIREBASE_PROJECT_ID = react-firebase-dbc76
   GOOGLE_APPLICATION_CREDENTIALS = /app/react-firebase-dbc76-firebase-adminsdk-z2n37-911e39435e.json
   ```

5. Click **Create Web Service**

6. Espera 5 minutos → Ve a **Environment** → **Secret Files** → **Add Secret File**:
   ```
   Filename: /app/react-firebase-dbc76-firebase-adminsdk-z2n37-911e39435e.json
   Contents: [Pega el contenido de tu archivo de credenciales Firebase]
   ```

7. **Copia la URL** del backend (ej: `https://tienda-ropa-backend.onrender.com`)

---

### 3️⃣ Despliega el FRONTEND (5 min)

1. **New +** → **Web Service**
2. Conecta el mismo repositorio
3. Configura:
   ```
   Name: tienda-ropa-frontend
   Environment: Docker
   Dockerfile Path: ./frontend/tienda-ropa/Dockerfile
   Docker Context: ./frontend/tienda-ropa
   Instance Type: Free ⭐
   ```

4. Agrega esta variable:
   ```
   NODE_ENV = production
   API_URL = [Pega la URL del backend del paso 2.7]
   ```

5. Click **Create Web Service**

---

### 4️⃣ Actualiza URLs en el Código (5 min)

Edita `frontend/tienda-ropa/src/environments/environment.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tienda-ropa-backend.onrender.com/api'  // Tu URL del backend
};
```

Edita `backend/src/index.js` (línea ~16):
```javascript
app.use(cors({
  origin: [
    'https://tienda-ropa-frontend.onrender.com',  // Tu URL del frontend
    'http://localhost:4200',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

Sube los cambios:
```bash
git add .
git commit -m "URLs de producción"
git push
```

Render re-desplegará automáticamente (5 min).

---

## ✅ ¡Listo!

- **Backend**: `https://tienda-ropa-backend.onrender.com`
- **Frontend**: `https://tienda-ropa-frontend.onrender.com`

---

## 💡 Importante

- ✅ **TODO ES GRATIS** - No necesitas tarjeta de crédito
- ⚠️ Los servicios se duermen después de 15 min sin uso
- ⚠️ El primer request después de dormir tarda ~30 segundos
- ✅ Tienes 750 horas/mes por servicio (suficiente para uso normal)

---

## 🆘 Si algo falla

1. **Backend no inicia**: Revisa los logs en Render → Logs
2. **Error de Firebase**: Verifica que el Secret File esté bien configurado
3. **CORS Error**: Actualiza las URLs en `backend/src/index.js`
4. **Frontend no carga**: Verifica que `API_URL` apunte al backend correcto

---

## 📱 Mantener Servicios Activos (Opcional)

Para evitar que se duerman, usa un servicio de ping gratuito:
- [UptimeRobot](https://uptimerobot.com) - Gratis
- [Cron-job.org](https://cron-job.org) - Gratis

Configura un ping cada 10 minutos a tu backend.
