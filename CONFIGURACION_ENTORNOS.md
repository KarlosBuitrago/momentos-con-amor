# 🔧 Configuración de Entornos (Desarrollo vs Producción)

## 🎯 Problema Resuelto

**Error:** `Http failure response for https://momentos-con-amor.onrender.com/api/invoices/generate: 404 OK`

**Causa:** El frontend estaba configurado para usar la URL de producción en lugar de localhost.

**Solución:** Actualizar el archivo `frontend/tienda-ropa/public/env.js` para usar localhost en desarrollo.

---

## 📁 Archivos de Configuración

### 1. `frontend/tienda-ropa/public/env.js`

Este archivo se carga en tiempo de ejecución y sobrescribe la configuración del environment.

**Para Desarrollo (Local):**
```javascript
window.env.API_URL = 'http://localhost:3000/api';
```

**Para Producción (Render):**
```javascript
window.env.API_URL = 'https://momentos-con-amor.onrender.com/api';
```

---

### 2. `frontend/tienda-ropa/src/environments/environment.ts`

Este archivo tiene la configuración por defecto, pero puede ser sobrescrita por `env.js`.

```typescript
export const environment = {
  production: false,
  apiUrl: (typeof window !== 'undefined' && (window as any)['env']?.['API_URL']) || 'http://localhost:3000/api',
  // ...
};
```

**Orden de prioridad:**
1. `window.env.API_URL` (desde `public/env.js`) ← **Tiene prioridad**
2. `'http://localhost:3000/api'` (valor por defecto)

---

## 🔄 Cómo Cambiar Entre Entornos

### Desarrollo Local

1. Editar `frontend/tienda-ropa/public/env.js`:
```javascript
window.env.API_URL = 'http://localhost:3000/api';
```

2. Recargar la página en el navegador (Ctrl + Shift + R)

3. Verificar en la consola del navegador:
```javascript
console.log(window.env.API_URL);
// Debe mostrar: http://localhost:3000/api
```

---

### Producción (Render)

1. Editar `frontend/tienda-ropa/public/env.js`:
```javascript
window.env.API_URL = 'https://momentos-con-amor.onrender.com/api';
```

2. Hacer commit y push:
```bash
git add frontend/tienda-ropa/public/env.js
git commit -m "Configurar URL de producción"
git push
```

3. Render detectará el cambio y redesplegará automáticamente

---

## 🚀 Configuración Recomendada

### Opción 1: Archivo Separado por Entorno (Recomendado)

Crear dos archivos:

**`frontend/tienda-ropa/public/env.development.js`:**
```javascript
(function(window) {
  window.env = window.env || {};
  window.env.API_URL = 'http://localhost:3000/api';
})(this);
```

**`frontend/tienda-ropa/public/env.production.js`:**
```javascript
(function(window) {
  window.env = window.env || {};
  window.env.API_URL = 'https://momentos-con-amor.onrender.com/api';
})(this);
```

Luego, copiar el archivo apropiado a `env.js` según el entorno.

---

### Opción 2: Detección Automática (Más Avanzado)

**`frontend/tienda-ropa/public/env.js`:**
```javascript
(function(window) {
  window.env = window.env || {};
  
  // Detectar entorno automáticamente
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
  
  if (isLocalhost) {
    // Desarrollo local
    window.env.API_URL = 'http://localhost:3000/api';
  } else {
    // Producción
    window.env.API_URL = 'https://momentos-con-amor.onrender.com/api';
  }
})(this);
```

**Ventaja:** No necesitas cambiar el archivo manualmente, se adapta automáticamente.

---

## 🧪 Verificar Configuración

### En el Navegador

1. Abrir la consola del navegador (F12)

2. Ejecutar:
```javascript
console.log('API URL:', window.env.API_URL);
```

3. Verificar que muestre la URL correcta:
   - **Local:** `http://localhost:3000/api`
   - **Producción:** `https://momentos-con-amor.onrender.com/api`

---

### Probar Conexión

**En desarrollo:**
```javascript
fetch('http://localhost:3000/api/products')
  .then(res => res.json())
  .then(data => console.log('Productos:', data))
  .catch(err => console.error('Error:', err));
```

**En producción:**
```javascript
fetch('https://momentos-con-amor.onrender.com/api/products')
  .then(res => res.json())
  .then(data => console.log('Productos:', data))
  .catch(err => console.error('Error:', err));
```

---

## 📋 Checklist de Configuración

### Para Desarrollo Local

- [ ] Backend corriendo en `http://localhost:3000`
- [ ] Frontend corriendo en `http://localhost:4200`
- [ ] `env.js` configurado con `http://localhost:3000/api`
- [ ] Página recargada en el navegador (Ctrl + Shift + R)
- [ ] Verificar en consola: `window.env.API_URL`
- [ ] Probar checkout y generación de factura

---

### Para Producción

- [ ] Backend desplegado en Render
- [ ] Frontend desplegado en Render
- [ ] `env.js` configurado con URL de producción
- [ ] Commit y push realizados
- [ ] Render ha redesplegado la aplicación
- [ ] Verificar en consola: `window.env.API_URL`
- [ ] Probar checkout en producción

---

## 🔍 Solución de Problemas

### Error: "404 Not Found" al generar factura

**Causa:** URL del API incorrecta.

**Solución:**
1. Verificar `window.env.API_URL` en la consola
2. Asegurarse de que el backend esté corriendo
3. Verificar que la URL no tenga espacios o caracteres extra
4. Recargar la página con Ctrl + Shift + R

---

### Error: "CORS policy" o "blocked by CORS"

**Causa:** El backend no permite peticiones desde el frontend.

**Solución en desarrollo:**
1. Verificar que el backend tenga CORS habilitado
2. En `backend/src/index.js` debe tener:
```javascript
app.use(cors());
```

**Solución en producción:**
1. Configurar CORS para permitir el dominio de producción:
```javascript
app.use(cors({
  origin: 'https://tu-frontend.onrender.com'
}));
```

---

### Error: "Connection refused" o "ERR_CONNECTION_REFUSED"

**Causa:** El backend no está corriendo.

**Solución:**
1. Iniciar el backend:
```bash
cd backend
npm run dev
```

2. Verificar que esté corriendo:
```bash
curl http://localhost:3000
```

---

## 🎊 Configuración Actual

**Desarrollo Local:**
- ✅ Backend: `http://localhost:3000`
- ✅ Frontend: `http://localhost:4200`
- ✅ API URL: `http://localhost:3000/api`

**Producción:**
- 🌐 Backend: `https://momentos-con-amor.onrender.com`
- 🌐 Frontend: (Por configurar)
- 🌐 API URL: `https://momentos-con-amor.onrender.com/api`

---

## 📝 Notas Importantes

1. **Siempre recargar la página** después de cambiar `env.js` (Ctrl + Shift + R)

2. **No hacer commit de `env.js` con configuración local** si vas a desplegar a producción

3. **Usar `.gitignore`** para excluir `env.js` si quieres configuraciones diferentes por desarrollador:
```
# .gitignore
frontend/tienda-ropa/public/env.js
```

4. **Crear `env.example.js`** como plantilla:
```javascript
// env.example.js
(function(window) {
  window.env = window.env || {};
  window.env.API_URL = 'CAMBIAR_POR_TU_URL';
})(this);
```

---

¡Ahora el frontend está configurado correctamente para desarrollo local! 🎉
