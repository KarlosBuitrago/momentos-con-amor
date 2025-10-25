# Configuración de Firebase en Render

## Problema Actual

El backend está desplegado pero muestra este warning:

```
La ruta GOOGLE_APPLICATION_CREDENTIALS (/app/react-firebase-dbc76-firebase-adminsdk-z2n37-911e39435e.json) no existe. Se usará almacenamiento local.
Credenciales de Firebase no encontradas. Usando almacenamiento local en disco (.local-data).
```

Esto significa que el backend está usando almacenamiento local en lugar de Firebase Firestore.

## Solución

Necesitas configurar las credenciales de Firebase como variable de entorno en Render.

### Paso 1: Obtener las Credenciales de Firebase

Las credenciales están en el archivo:

```
backend/react-firebase-dbc76-firebase-adminsdk-z2n37-911e39435e.json
```

### Paso 2: Convertir el JSON a una Línea

Necesitas convertir todo el contenido del archivo JSON a una sola línea sin espacios ni saltos de línea.

**Opción A: Usando un comando (Linux/Mac/Git Bash)**

```bash
cat backend/react-firebase-dbc76-firebase-adminsdk-z2n37-911e39435e.json | jq -c
```

**Opción B: Manualmente**

1. Abre el archivo JSON
2. Copia todo el contenido
3. Usa una herramienta online como <https://www.text-utils.com/json-formatter/>
4. Pega el JSON y selecciona "Minify" o "Compact"
5. Copia el resultado (será una sola línea)

### Paso 3: Configurar en Render

1. Ve a tu servicio de backend en Render: <https://dashboard.render.com>
2. Selecciona tu servicio "momentos-con-amor" (backend)
3. Ve a la pestaña **Environment**
4. Haz clic en **Add Environment Variable**
5. Agrega la siguiente variable:

```
Key: FIREBASE_SERVICE_ACCOUNT
Value: [pega aquí el JSON en una sola línea]
```

**Ejemplo del formato (NO uses este, usa tu propio JSON):**

```json
{"type":"service_account","project_id":"react-firebase-dbc76","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

6. Haz clic en **Save Changes**
7. Render automáticamente redesplegará tu servicio

### Paso 4: Verificar

Después del redespliegue, revisa los logs en Render. Deberías ver:

```
Firebase inicializado con credenciales de servicio.
Servidor corriendo en puerto 10000
Entorno: production
```

En lugar de:

```
Credenciales de Firebase no encontradas. Usando almacenamiento local en disco (.local-data).
```

## Variables de Entorno Adicionales (Opcionales)

También puedes configurar estas variables si lo deseas:

```
FIREBASE_PROJECT_ID=react-firebase-dbc76
FIREBASE_STORAGE_BUCKET=react-firebase-dbc76.appspot.com
```

Pero no son necesarias si ya están en el JSON de credenciales.

## Verificación de Funcionamiento

Una vez configurado, puedes verificar que Firebase está funcionando:

1. Accede a tu API: <https://momentos-con-amor.onrender.com/api/products>
2. Deberías ver los productos almacenados en Firebase Firestore
3. Si ves productos, Firebase está funcionando correctamente

## Troubleshooting

### Error: "Cannot parse FIREBASE_SERVICE_ACCOUNT"

**Causa:** El JSON no está bien formateado o tiene caracteres especiales mal escapados.

**Solución:**

1. Asegúrate de que el JSON esté en una sola línea
2. Verifica que las comillas estén correctamente escapadas
3. Usa `jq -c` para minificar el JSON correctamente

### Error: "Invalid private key"

**Causa:** La clave privada tiene saltos de línea incorrectos.

**Solución:**

1. Asegúrate de que `\n` esté presente en la clave privada
2. No reemplaces `\n` por saltos de línea reales
3. El formato debe ser: `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`

### Los datos no persisten después de redesplegar

**Causa:** Estás usando almacenamiento local en lugar de Firebase.

**Solución:**

1. Verifica que la variable `FIREBASE_SERVICE_ACCOUNT` esté configurada
2. Revisa los logs para confirmar que dice "Firebase inicializado con credenciales de servicio"
3. Si sigue usando almacenamiento local, verifica que el JSON sea válido

## Seguridad

⚠️ **IMPORTANTE:**

- Nunca compartas tus credenciales de Firebase públicamente
- No las subas a repositorios públicos de Git
- Usa variables de entorno en Render para mantenerlas seguras
- El archivo `.gitignore` ya está configurado para ignorar el archivo de credenciales

## Alternativa: Usar Archivo en el Contenedor (No Recomendado)

Si prefieres usar el archivo en lugar de la variable de entorno, necesitarías:

1. Modificar el Dockerfile para copiar el archivo
2. Configurar `GOOGLE_APPLICATION_CREDENTIALS` en Render
3. Esto es menos seguro y no se recomienda

La opción recomendada es usar `FIREBASE_SERVICE_ACCOUNT` como variable de entorno.
