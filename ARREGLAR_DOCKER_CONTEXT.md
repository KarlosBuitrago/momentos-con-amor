# 🔧 ARREGLAR Docker Context en Render

## 🔴 Error Actual:
```
"/package.json": not found
```

## ❌ Causa del Problema:

El **Docker Context** NO está configurado correctamente en Render. Render está buscando los archivos en la raíz del repositorio, pero tu código está en subcarpetas:
- Backend: `./backend/`
- Frontend: `./frontend/tienda-ropa/`

---

## ✅ SOLUCIÓN INMEDIATA:

### Para el Backend:

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Click en tu servicio **`tienda-ropa-backend`**
3. Click en **"Settings"** en el menú lateral izquierdo
4. Scroll hasta la sección **"Build & Deploy"**
5. Busca el campo **"Docker Context"**
6. Cámbialo a: `./backend`
7. Click en **"Save Changes"** (botón azul abajo)
8. Render automáticamente re-desplegará el servicio

---

### Para el Frontend:

1. En Render Dashboard, click en **`tienda-ropa-frontend`**
2. Click en **"Settings"**
3. Scroll hasta **"Build & Deploy"**
4. Busca **"Docker Context"**
5. Cámbialo a: `./frontend/tienda-ropa`
6. Click en **"Save Changes"**
7. Render automáticamente re-desplegará el servicio

---

## 📋 Configuración Correcta Completa:

### Backend:
```
Name: tienda-ropa-backend
Environment: Docker
Dockerfile Path: ./backend/Dockerfile
Docker Context: ./backend          ← ESTO ES CRÍTICO
Instance Type: Free
```

### Frontend:
```
Name: tienda-ropa-frontend
Environment: Docker
Dockerfile Path: ./frontend/tienda-ropa/Dockerfile
Docker Context: ./frontend/tienda-ropa    ← ESTO ES CRÍTICO
Instance Type: Free
```

---

## 🎯 ¿Por Qué Es Importante?

El **Docker Context** le dice a Render desde qué carpeta debe ejecutar el Dockerfile.

**Sin Docker Context correcto:**
```
Repositorio raíz/
  ├── backend/
  │   ├── package.json     ← Render NO puede encontrar esto
  │   └── Dockerfile
```

**Con Docker Context correcto (`./backend`):**
```
backend/                   ← Render empieza aquí
  ├── package.json         ← Render SÍ puede encontrar esto
  └── Dockerfile
```

---

## ⏱️ Tiempo Estimado:

- Cambiar configuración: **30 segundos**
- Re-deployment automático: **2-3 minutos** (backend), **5-7 minutos** (frontend)

---

## ✅ Verificación:

Después de cambiar el Docker Context y esperar el re-deployment:

**Backend:**
- Estado: **"Live"** (verde)
- URL funciona: `https://tienda-ropa-backend.onrender.com/`
- Respuesta: `{"message": "API de Tienda de muñecos funcionando correctamente"}`

**Frontend:**
- Estado: **"Live"** (verde)
- URL funciona: `https://tienda-ropa-frontend.onrender.com/`
- Se ve la tienda

---

## 🆘 Si No Encuentras "Docker Context":

Si no ves el campo "Docker Context" en Settings:

1. Verifica que **Environment** esté en **"Docker"** (no "Node")
2. Si está en "Node", debes:
   - Eliminar el servicio actual
   - Crear uno nuevo con Environment = Docker
   - Configurar Docker Context desde el inicio

---

## 📸 Captura de Pantalla de Referencia:

En la sección **"Build & Deploy"** deberías ver:

```
Environment: Docker
Dockerfile Path: ./backend/Dockerfile
Docker Context: ./backend              ← Aquí cambias
```

---

¡Eso es todo! Solo cambia el Docker Context en Settings y Render hará el resto.
