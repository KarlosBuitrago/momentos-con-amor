# Solución - Error de bcrypt en Render

## El Problema

```
npm error command failed
npm error signal SIGTERM
```

Este error ocurre porque bcrypt requiere compilación nativa y la imagen Docker `node:18-alpine` no tiene las herramientas necesarias por defecto.

## La Solución

Se actualizó el Dockerfile para instalar las dependencias necesarias:
- python3
- make
- g++

Estas herramientas permiten que bcrypt se compile correctamente durante el build de Docker.

## Cambios Realizados

### `backend/Dockerfile`

**Antes:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install --production
```

**Después:**
```dockerfile
FROM node:18-alpine

# Instalar dependencias necesarias para bcrypt
RUN apk add --no-cache python3 make g++

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install --production
```

## Pasos para Desplegar

### 1️⃣ Hacer Commit y Push

```bash
git add .
git commit -m "Fix: Agregar dependencias para bcrypt en Docker"
git push
```

### 2️⃣ Render Redesplegará Automáticamente

Render detectará los cambios y comenzará un nuevo build.

### 3️⃣ Verificar el Build

En los logs de Render deberías ver:

```
✅ Fetching packages...
✅ Installing dependencies...
✅ bcrypt@5.1.1 installed successfully
✅ Firebase inicializado con credenciales de servicio.
✅ Servidor corriendo en puerto 10000
```

## Verificación

Una vez desplegado, prueba el login:

```bash
curl -X POST https://momentos-con-amor.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tiendaropa.com","password":"Admin123!"}'
```

Deberías recibir:
```json
{
  "message": "Inicio de sesión exitoso",
  "token": "...",
  "user": {
    "id": "admin-001",
    "email": "admin@tiendaropa.com",
    "firstName": "Admin",
    "lastName": "Sistema",
    "role": "admin"
  }
}
```

## Alternativa: Usar node:18 (sin alpine)

Si el problema persiste, puedes cambiar la imagen base:

```dockerfile
FROM node:18
```

En lugar de:
```dockerfile
FROM node:18-alpine
```

La imagen `node:18` es más pesada pero incluye todas las herramientas necesarias.

## Troubleshooting

### El build sigue fallando

**Opción 1:** Cambiar a imagen completa
```dockerfile
FROM node:18
```

**Opción 2:** Limpiar cache de Render
1. Ve a tu servicio en Render
2. Settings → Clear build cache
3. Manual Deploy → Deploy latest commit

### Error: "python3: not found"

**Causa:** Las dependencias no se instalaron correctamente.

**Solución:** Verifica que la línea `RUN apk add --no-cache python3 make g++` esté antes de `RUN npm install`.

### El servidor inicia pero el login falla

**Causa:** El usuario admin no tiene contraseña hasheada.

**Solución:** Ejecuta localmente:
```bash
npm run update-admin-password
```

Luego haz commit y push de los cambios en Firestore.

## Tiempo de Build

Con las nuevas dependencias, el build puede tardar un poco más:
- **Antes:** ~2-3 minutos
- **Después:** ~3-5 minutos

Esto es normal porque bcrypt necesita compilarse.

## Notas de Seguridad

✅ bcrypt es la forma recomendada de hashear contraseñas
✅ Las dependencias agregadas (python3, make, g++) solo se usan durante el build
✅ No afectan la seguridad del contenedor en runtime
