# ✅ Solución al Error del Frontend

## 🔴 Error Original:
```
Error: Cannot find module '/app/dist/tienda-ropa/server/server.mjs'
```

## ❌ Causa del Problema:

El proyecto Angular tiene SSR configurado pero el comando `npm run build` solo genera el build del browser, NO el servidor SSR. El archivo `server.mjs` no existe porque no se está generando.

## ✅ Solución Aplicada:

He simplificado el Dockerfile del frontend para servir la aplicación como **sitio estático** usando Express, en lugar de intentar usar SSR.

### Cambios en el Dockerfile:

**ANTES (intentaba usar SSR que no existe):**
```dockerfile
CMD ["npm", "run", "serve:ssr:tienda-ropa"]
```

**AHORA (servidor estático simple):**
```dockerfile
# Instala Express
# Copia solo los archivos del browser
# Crea un servidor simple que sirve los archivos estáticos
CMD ["node", "server.js"]
```

---

## 🚀 Próximos Pasos:

### 1️⃣ Hacer Commit y Push:

```bash
git add frontend/tienda-ropa/Dockerfile
git commit -m "Fix: Frontend Dockerfile - usar servidor estático"
git push
```

### 2️⃣ Re-desplegar Frontend en Render:

1. Ve a tu servicio `tienda-ropa-frontend` en Render
2. Click en **"Manual Deploy"** → **"Deploy latest commit"**
3. Espera 5-7 minutos

### 3️⃣ Verificar:

- Estado: **"Live"** (verde)
- URL funciona: `https://tienda-ropa-frontend.onrender.com/`
- La tienda se carga correctamente

---

## 📋 Configuración Correcta del Frontend:

```
Name: tienda-ropa-frontend
Environment: Docker
Dockerfile Path: ./frontend/tienda-ropa/Dockerfile
Docker Context: ./frontend/tienda-ropa
Instance Type: Free
```

**Variables de Entorno:**
```
NODE_ENV = production
API_URL = https://tienda-ropa-backend.onrender.com
```

---

## 🎯 ¿Por Qué Esta Solución?

Angular SSR requiere configuración adicional y scripts específicos. Para simplificar el deployment:

1. **Build**: Genera los archivos estáticos del browser
2. **Servidor**: Express simple que sirve esos archivos
3. **Routing**: Todas las rutas redirigen a `index.html` (SPA)

Esto es más simple, más rápido y funciona perfectamente para tu tienda.

---

## ✅ Resultado Esperado:

Después del re-deployment:
- ✅ Frontend funcionando en Render
- ✅ Todas las rutas funcionan (/, /productos, /admin, etc.)
- ✅ Se conecta al backend correctamente
- ✅ Sin errores de SSR

---

## 🆘 Si Aún Falla:

1. **Revisa los logs** en Render → Logs
2. **Verifica el Docker Context**: Debe ser `./frontend/tienda-ropa`
3. **Verifica la variable API_URL**: Debe apuntar a tu backend
4. **Prueba localmente**:
   ```bash
   cd frontend/tienda-ropa
   docker build -t test-frontend .
   docker run -p 4000:4000 test-frontend
   ```

---

¡El Dockerfile está arreglado! Solo necesitas hacer push y re-desplegar.
