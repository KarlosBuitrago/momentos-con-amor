# Variables de Entorno en el Frontend

## Problema Resuelto

Antes, la URL del API estaba "quemada" en el código. Ahora usa variables de entorno que se pueden configurar sin modificar el código.

## Cómo Funciona

### 1. Archivo `env.js`

Se genera un archivo `env.js` que se carga antes de la aplicación Angular:

```javascript
window.env = {
  API_URL: 'https://momentos-con-amor.onrender.com/api'
};
```

### 2. Lectura en `environment.ts`

Los archivos de environment leen de `window.env`:

```typescript
export const environment = {
  production: false,
  apiUrl: (typeof window !== 'undefined' && (window as any)['env']?.['API_URL']) 
    || 'http://localhost:3000/api',
  // ...
};
```

**Orden de prioridad:**

1. `window.env.API_URL` (variable de entorno)
2. Valor por defecto en el código

## Configuración

### Desarrollo Local

#### Opción 1: Usar Backend Local

No necesitas hacer nada. Por defecto usa `http://localhost:3000/api`

#### Opción 2: Usar Backend en Render

Edita `frontend/tienda-ropa/public/env.js`:

```javascript
window.env = {
  API_URL: 'https://momentos-con-amor.onrender.com/api'
};
```

### Producción en Render

#### 1. Configurar Variable de Entorno

En el dashboard de Render:

1. Ve a tu servicio de frontend
2. Environment → Add Environment Variable
3. Agrega:

   ```
   Key: API_URL
   Value: https://momentos-con-amor.onrender.com/api
   ```

#### 2. El Build Automático

El script `generate-env.js` se ejecuta automáticamente después del build y genera el archivo `env.js` con la variable de entorno.

## Scripts Disponibles

### `npm run build`

Build de desarrollo + genera env.js

### `npm run build:prod`

Build de producción + genera env.js

### `npm run generate-env`

Solo genera el archivo env.js (útil para testing)

## Estructura de Archivos

```
frontend/tienda-ropa/
├── src/
│   ├── index.html              # Carga env.js
│   └── environments/
│       ├── environment.ts      # Lee window.env.API_URL
│       └── environment.prod.ts # Lee window.env.API_URL
├── public/
│   └── env.js                  # Valores por defecto (desarrollo)
├── generate-env.js             # Script para generar env.js (Node.js)
└── generate-env.sh             # Script para generar env.js (Bash)
```

## Valores por Defecto

### Desarrollo (`environment.ts`)

```typescript
apiUrl: 'http://localhost:3000/api'
```

### Producción (`environment.prod.ts`)

```typescript
apiUrl: 'https://momentos-con-amor.onrender.com/api'
```

Estos valores se usan solo si `window.env.API_URL` no está definido.

## Ventajas

✅ **No más URLs quemadas** - Fácil cambiar entre entornos
✅ **Sin rebuild** - Puedes cambiar la URL sin recompilar
✅ **Múltiples entornos** - Dev, staging, producción
✅ **Seguridad** - No expones URLs en el código fuente
✅ **Flexibilidad** - Cada despliegue puede tener su propia configuración

## Ejemplos de Uso

### Cambiar URL sin Rebuild

Si ya desplegaste y quieres cambiar la URL:

1. Edita `dist/tienda-ropa/browser/env.js` directamente:

```javascript
window.env = {
  API_URL: 'https://nueva-url.com/api'
};
```

2. No necesitas rebuild, solo refresca el navegador

### Múltiples Backends

Puedes tener diferentes backends para diferentes propósitos:

```javascript
// Desarrollo
window.env.API_URL = 'http://localhost:3000/api';

// Staging
window.env.API_URL = 'https://staging-backend.onrender.com/api';

// Producción
window.env.API_URL = 'https://momentos-con-amor.onrender.com/api';
```

### Testing

Para probar contra diferentes backends:

```bash
# Backend local
API_URL=http://localhost:3000/api npm run build

# Backend en Render
API_URL=https://momentos-con-amor.onrender.com/api npm run build
```

## Troubleshooting

### Error: "env.js not found"

**Causa:** El archivo no se generó durante el build.

**Solución:**

```bash
npm run generate-env
```

### La URL no cambia

**Causa:** El navegador tiene cache.

**Solución:**

1. Limpia el cache del navegador (Ctrl+Shift+Delete)
2. O abre en modo incógnito
3. O usa hard refresh (Ctrl+F5)

### Error en Windows: "bash: command not found"

**Causa:** Windows no tiene bash por defecto.

**Solución:**
El script automáticamente usa `generate-env.js` (Node.js) como fallback.

## Migración desde URLs Quemadas

Si tienes URLs quemadas en otros lugares:

### Antes

```typescript
const API_URL = 'https://momentos-con-amor.onrender.com/api';
```

### Después

```typescript
const API_URL = (window as any)['env']?.['API_URL'] 
  || 'https://momentos-con-amor.onrender.com/api';
```

## Próximos Pasos

1. ✅ Variables de entorno implementadas
2. ⏳ Configurar en Render
3. ⏳ Probar en desarrollo
4. ⏳ Desplegar en producción
5. ⏳ Agregar más variables (Firebase config, etc.)

## Variables Adicionales (Futuro)

Puedes agregar más variables al sistema:

```javascript
window.env = {
  API_URL: 'https://momentos-con-amor.onrender.com/api',
  FIREBASE_API_KEY: 'AIzaSy...',
  ANALYTICS_ID: 'G-...',
  SENTRY_DSN: 'https://...'
};
```

Y leerlas en `environment.ts`:

```typescript
export const environment = {
  apiUrl: window.env.API_URL || 'http://localhost:3000/api',
  firebaseApiKey: window.env.FIREBASE_API_KEY || 'default-key',
  // ...
};
```
