# Solución - Frontend no se conecta al Backend

## El Problema

El frontend estaba intentando conectarse a `http://localhost:3000/api` en lugar de la URL de producción del backend en Render.

**Síntoma:**

- El login desde el HTML de prueba funciona ✅
- El login desde el frontend de Angular falla ❌

**Causa:**
Los archivos de environment tenían URLs incorrectas.

## La Solución

Se actualizaron los archivos de environment para apuntar a la URL correcta del backend en Render.

### Archivos Modificados

#### `frontend/tienda-ropa/src/environments/environment.prod.ts`

**Antes:**

```typescript
apiUrl: 'https://tienda-ropa-backend.onrender.com/api'
```

**Después:**

```typescript
apiUrl: 'https://momentos-con-amor.onrender.com/api'
```

#### `frontend/tienda-ropa/src/environments/environment.ts`

**Antes:**

```typescript
apiUrl: 'http://localhost:3000/api'
```

**Después:**

```typescript
apiUrl: 'https://momentos-con-amor.onrender.com/api'
```

## Pasos para Aplicar la Solución

### Opción 1: Desarrollo Local

Si quieres probar localmente contra el backend en Render:

```bash
cd frontend/tienda-ropa
npm start
```

El frontend ahora se conectará al backend en Render.

### Opción 2: Desplegar en Producción

```bash
git add .
git commit -m "Fix: Actualizar URL del API a Render"
git push
```

Si tienes el frontend desplegado en Render o Vercel, se redesplegará automáticamente.

## Verificación

### 1. Probar Localmente

```bash
cd frontend/tienda-ropa
npm start
```

Luego ve a <http://localhost:4200/login> e intenta iniciar sesión con:

- Email: <admin@tiendaropa.com>
- Password: Admin123!

### 2. Verificar en la Consola del Navegador

Abre las DevTools (F12) y ve a la pestaña Network. Deberías ver:

```
Request URL: https://momentos-con-amor.onrender.com/api/auth/login
Status: 200 OK
```

### 3. Verificar el Token

Si el login es exitoso, deberías ver en localStorage:

- `auth_token`: El token JWT
- `current_user`: Los datos del usuario

## Configuración para Diferentes Entornos

### Desarrollo Local con Backend Local

Si quieres usar el backend local durante el desarrollo:

**`environment.ts`:**

```typescript
apiUrl: 'http://localhost:3000/api'
```

### Desarrollo Local con Backend en Render

**`environment.ts`:**

```typescript
apiUrl: 'https://momentos-con-amor.onrender.com/api'
```

### Producción

**`environment.prod.ts`:**

```typescript
apiUrl: 'https://momentos-con-amor.onrender.com/api'
```

## CORS

El backend ya tiene CORS configurado para aceptar peticiones desde cualquier origen, así que no deberías tener problemas de CORS.

Si tienes problemas, verifica en `backend/src/index.js`:

```javascript
app.use(cors({
  origin: '*',
  credentials: true
}));
```

## Troubleshooting

### Error: "Failed to fetch"

**Causa:** El backend no está accesible o la URL es incorrecta.

**Solución:**

1. Verifica que el backend esté corriendo: <https://momentos-con-amor.onrender.com/api/products>
2. Verifica la URL en `environment.ts` o `environment.prod.ts`

### Error: "CORS policy"

**Causa:** El backend no permite peticiones desde el origen del frontend.

**Solución:**
Verifica la configuración de CORS en el backend.

### El login funciona pero no redirige

**Causa:** El router de Angular no está configurado correctamente.

**Solución:**
Verifica las rutas en `app.routes.ts` y que `/admin` esté definida.

## URLs Importantes

- **Backend API:** <https://momentos-con-amor.onrender.com/api>
- **Test Login:** <https://momentos-con-amor.onrender.com/api/auth/login>
- **Test Products:** <https://momentos-con-amor.onrender.com/api/products>

## Próximos Pasos

1. ✅ Actualizar URLs en environment files
2. ✅ Probar login localmente
3. ⏳ Desplegar frontend en producción
4. ⏳ Configurar dominio personalizado (opcional)
