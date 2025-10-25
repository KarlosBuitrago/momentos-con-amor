# Solución - Problema de Autenticación

## El Problema

El sistema no valida las contraseñas correctamente porque:
1. El usuario admin fue creado sin contraseña hasheada
2. El controlador de login no validaba contraseñas

## La Solución

Se implementó un sistema de autenticación con bcrypt que:
- Hashea las contraseñas antes de guardarlas
- Valida las contraseñas correctamente en el login
- Funciona con o sin Firebase Auth

## Pasos para Solucionar

### 1️⃣ Instalar Dependencias

```bash
cd backend
npm install
```

Esto instalará bcrypt que se agregó a las dependencias.

### 2️⃣ Actualizar la Contraseña del Admin Existente

```bash
npm run update-admin-password
```

Esto actualizará el usuario admin existente con una contraseña hasheada.

### 3️⃣ Redesplegar en Render

Después de hacer commit y push de los cambios, Render redesplegará automáticamente.

O puedes hacer un redespliegue manual desde el dashboard de Render.

### 4️⃣ Probar el Login

Usa estas credenciales:
- **Email:** admin@tiendaropa.com
- **Password:** Admin123!

## Cambios Realizados

### Backend

1. **Agregado bcrypt** para hashear contraseñas
2. **Actualizado authController.js:**
   - El login ahora valida contraseñas hasheadas
   - El registro hashea contraseñas antes de guardar
3. **Actualizado createAdminUserSimple.js:**
   - Ahora guarda contraseñas hasheadas
4. **Creado updateAdminPassword.js:**
   - Script para actualizar contraseñas de usuarios existentes

## Credenciales por Defecto

```
Email: admin@tiendaropa.com
Password: Admin123!
```

⚠️ **IMPORTANTE:** Cambia esta contraseña después del primer inicio de sesión.

## Verificación Local

Antes de desplegar, puedes probar localmente:

```bash
# 1. Actualizar contraseña del admin
npm run update-admin-password

# 2. Iniciar el servidor
npm run dev

# 3. Probar el login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tiendaropa.com","password":"Admin123!"}'
```

Deberías recibir un token de autenticación.

## Troubleshooting

### Error: "bcrypt not found"

**Solución:**
```bash
cd backend
npm install bcrypt
```

### Error: "Credenciales inválidas" después de actualizar

**Causa:** El usuario no tiene passwordHash en Firestore.

**Solución:**
```bash
npm run update-admin-password
```

### El usuario no existe

**Solución:**
```bash
npm run create-admin-simple
```

## Seguridad

✅ Las contraseñas ahora se guardan hasheadas con bcrypt
✅ El login valida las contraseñas correctamente
✅ No se exponen contraseñas en los logs (ya limpiados anteriormente)
✅ Los tokens se generan solo después de validar credenciales

## Próximos Pasos Recomendados

1. Cambiar la contraseña por defecto después del primer login
2. Implementar un endpoint para cambiar contraseñas
3. Agregar límite de intentos de login fallidos
4. Implementar recuperación de contraseña por email
