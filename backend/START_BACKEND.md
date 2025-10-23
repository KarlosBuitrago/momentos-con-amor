# Cómo Iniciar el Backend

## Inicio Rápido

```bash
cd backend
npm run dev
```

## Verificar que Funciona

1. Deberías ver en la consola:
   ```
   Servidor corriendo en http://localhost:3000
   ```

2. Abre tu navegador en: http://localhost:3000
   - Deberías ver: `{"message":"API de Tienda de muñecos funcionando correctamente"}`

3. Verifica los productos: http://localhost:3000/api/products

## Poblar Productos de Ejemplo

Si la base de datos está vacía, ejecuta:

**PowerShell:**
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/products/seed -Method POST
```

**CMD:**
```cmd
curl -X POST http://localhost:3000/api/products/seed
```

Esto creará 3 productos de ejemplo (Conejito, Osito, Unicornio).

## Solución de Problemas

### Error: Puerto 3000 en uso
```bash
# Encuentra el proceso usando el puerto
netstat -ano | findstr :3000

# Mata el proceso (reemplaza PID con el número que aparece)
taskkill /PID <PID> /F
```

### Error: Firebase no configurado
- El backend funcionará con almacenamiento local en `.local-data/`
- Para usar Firebase real, sigue las instrucciones en `FIREBASE_SETUP.md`

### Error: Módulos no encontrados
```bash
npm install
```

## Comandos Útiles

```bash
# Iniciar en modo desarrollo (con auto-restart)
npm run dev

# Iniciar en modo producción
npm start

# Ver logs del servidor
# Los logs aparecen directamente en la consola
```

## Probar la Comunicación con el Frontend

1. Inicia el backend: `npm run dev` (en carpeta backend)
2. Inicia el frontend: `npm start` (en carpeta frontend/tienda-ropa)
3. Abre http://localhost:4200
4. Los productos deberían cargarse desde el backend (no desde localStorage)
