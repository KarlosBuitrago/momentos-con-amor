# Solución Rápida - Configurar Firebase en Render

## El Problema
Tu backend está usando almacenamiento local en lugar de Firebase porque no encuentra las credenciales.

## La Solución (3 pasos)

### 1️⃣ Generar la Variable de Entorno

Ejecuta este comando en tu terminal:

```bash
cd backend
npm run generate-firebase-env
```

Esto te mostrará algo como:
```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

### 2️⃣ Copiar el Valor

Copia **TODA** la línea que empieza con `FIREBASE_SERVICE_ACCOUNT=`

### 3️⃣ Configurar en Render

1. Ve a https://dashboard.render.com
2. Selecciona tu servicio backend "momentos-con-amor"
3. Ve a la pestaña **Environment**
4. Haz clic en **Add Environment Variable**
5. Pega:
   - **Key:** `FIREBASE_SERVICE_ACCOUNT`
   - **Value:** (pega el JSON completo, sin incluir "FIREBASE_SERVICE_ACCOUNT=")
6. Haz clic en **Save Changes**

Render redesplegará automáticamente tu servicio.

## ✅ Verificar que Funciona

Después del redespliegue, revisa los logs en Render. Deberías ver:

```
✅ Firebase inicializado con credenciales de servicio.
   Servidor corriendo en puerto 10000
```

En lugar de:

```
❌ Credenciales de Firebase no encontradas. Usando almacenamiento local en disco (.local-data).
```

## 🔍 Probar la API

Visita: https://momentos-con-amor.onrender.com/api/products

Deberías ver los productos almacenados en Firebase.

---

**Nota:** Si tienes problemas, revisa el archivo `RENDER_FIREBASE_SETUP.md` para más detalles.
