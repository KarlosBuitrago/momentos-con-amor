# ✅ Activar Firebase en el Backend

## 🔴 Problema:

El archivo de credenciales de Firebase existe, pero estaba **comentado** en el `.env`, por lo que el backend usaba el mock storage en lugar de Firebase real.

---

## ✅ Solución Aplicada:

He descomentado la línea en `backend/.env`:

**ANTES:**
```env
# Firebase Service Account Path (comentado para usar mock storage)
# GOOGLE_APPLICATION_CREDENTIALS=./react-firebase-dbc76-firebase-adminsdk-z2n37-911e39435e.json
```

**AHORA:**
```env
# Firebase Service Account Path
GOOGLE_APPLICATION_CREDENTIALS=./react-firebase-dbc76-firebase-adminsdk-z2n37-911e39435e.json
```

---

## 🚀 Próximos Pasos:

### 1️⃣ Reiniciar el Backend:

```bash
# Detén el backend actual (Ctrl+C)
cd backend
npm run dev
```

### 2️⃣ Verificar que Firebase se Inicializó:

Deberías ver en los logs:

```
✅ Firebase inicializado con credenciales de servicio.
Servidor corriendo en puerto 3000
Entorno: development
```

**NO deberías ver:**
```
❌ Credenciales de Firebase no encontradas. Usando almacenamiento local...
```

---

## 🔍 Verificación Completa:

### 1. Verificar Archivo de Credenciales:

```bash
cd backend
dir react-firebase-dbc76-firebase-adminsdk-z2n37-911e39435e.json
```

Debe mostrar el archivo (2.4 KB aproximadamente).

### 2. Verificar Variable de Entorno:

```bash
# En PowerShell (Windows)
cd backend
Get-Content .env | Select-String "GOOGLE_APPLICATION_CREDENTIALS"
```

Debe mostrar la línea **sin el #** al inicio.

### 3. Probar Conexión a Firebase:

Una vez reiniciado el backend, prueba:

```bash
# Obtener productos (debe conectarse a Firebase)
curl http://localhost:3000/api/products
```

Si Firebase está configurado correctamente, debería:
- Conectarse a Firestore en la nube
- Retornar los productos guardados en Firebase
- NO usar `.local-data/`

---

## 🧪 Probar CRUD Completo:

### 1. Login como Admin:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@tiendaropa.com\",\"password\":\"admin123\"}"
```

Guarda el `token` de la respuesta.

### 2. Crear Producto:

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d "{\"name\":\"Producto de Prueba\",\"description\":\"Test\",\"price\":10000,\"category\":\"Muñecos\",\"targetAudience\":\"Unisex\",\"imageUrl\":\"test.jpg\",\"stock\":5}"
```

### 3. Eliminar Producto:

```bash
curl -X DELETE http://localhost:3000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 📊 Diferencias: Mock vs Firebase Real

| Aspecto | Mock Storage | Firebase Real |
|---------|--------------|---------------|
| Mensaje al iniciar | "Usando almacenamiento local..." | "Firebase inicializado..." |
| Ubicación de datos | `.local-data/*.json` | Firestore (nube) |
| Tokens | Base64 simple | JWT de Firebase |
| Persistencia | Solo local | En la nube |
| Compartir datos | ❌ No | ✅ Sí |

---

## ⚠️ Notas Importantes:

### Si Usas Firebase Real:

1. **Los datos están en la nube** - Puedes verlos en Firebase Console
2. **Los tokens son JWT reales** - Más seguros
3. **Requiere internet** - Para conectarse a Firestore
4. **Compartido entre instancias** - Todos ven los mismos datos

### Si Usas Mock Storage:

1. **Los datos están en `.local-data/`** - Solo en tu máquina
2. **Los tokens son simples** - Solo para desarrollo
3. **No requiere internet** - Todo es local
4. **No compartido** - Cada instancia tiene sus propios datos

---

## 🆘 Troubleshooting:

### "Sigo viendo 'Usando almacenamiento local...'"

**Causas posibles:**

1. **No reiniciaste el backend** después de cambiar `.env`
   - Solución: Detén (Ctrl+C) y reinicia `npm run dev`

2. **El archivo de credenciales no existe**
   - Solución: Verifica con `dir react-firebase-dbc76-firebase-adminsdk-z2n37-911e39435e.json`

3. **La ruta en .env es incorrecta**
   - Solución: Debe ser `./react-firebase-dbc76-firebase-adminsdk-z2n37-911e39435e.json`

4. **El archivo .env no se está cargando**
   - Solución: Verifica que `dotenv` esté instalado: `npm list dotenv`

### "Error: Cannot find module './react-firebase-dbc76...'"

**Solución**: La ruta es relativa al directorio donde ejecutas el comando.

```bash
# Asegúrate de estar en la carpeta backend
cd backend
npm run dev
```

### "Firebase error: Permission denied"

**Solución**: Las credenciales pueden estar mal o el proyecto de Firebase no existe.

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Verifica que el proyecto `react-firebase-dbc76` existe
3. Descarga nuevas credenciales si es necesario

---

## ✅ Checklist de Verificación:

- [ ] Archivo `.env` tiene `GOOGLE_APPLICATION_CREDENTIALS` descomentado
- [ ] Archivo de credenciales existe en `backend/react-firebase-dbc76-firebase-adminsdk-z2n37-911e39435e.json`
- [ ] Backend reiniciado después de cambiar `.env`
- [ ] Logs muestran "Firebase inicializado con credenciales de servicio"
- [ ] Login funciona y genera token
- [ ] Crear producto funciona
- [ ] Editar producto funciona
- [ ] Eliminar producto funciona
- [ ] Productos se ven en Firebase Console

---

## 🎉 Resultado Esperado:

Después de reiniciar el backend, deberías ver:

```
Firebase inicializado con credenciales de servicio.
Servidor corriendo en puerto 3000
Entorno: development
```

Y todas las operaciones CRUD deberían funcionar correctamente, guardando datos en Firebase Firestore (nube) en lugar de `.local-data/`.

---

¡Firebase está activado! Ahora tus datos se guardan en la nube. 🚀
