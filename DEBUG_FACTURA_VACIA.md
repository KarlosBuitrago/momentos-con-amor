# 🔍 Debug: Factura Vacía

## Problema Actual

La factura se muestra pero todos los campos están vacíos:
- Fecha: vacía
- Estado: vacío  
- Cliente: vacío
- Productos: sin items
- Totales: vacíos

## 🧪 Pasos para Diagnosticar

### 1. Abrir Consola del Navegador

1. Presiona **F12** para abrir las herramientas de desarrollador
2. Ve a la pestaña **Console**
3. Limpia la consola (icono 🚫 o Ctrl + L)

### 2. Generar Factura

1. Completa el formulario de checkout
2. Haz clic en "Generar Factura"
3. Observa los logs en la consola

### 3. Verificar Logs

Deberías ver dos logs:

**Log 1: Datos enviados**
```javascript
Enviando datos de factura: {
  customer: {
    name: "...",
    email: "...",
    // ...
  },
  items: [...],
  paymentMethod: "...",
  userId: "..."
}
```

**Log 2: Factura recibida**
```javascript
Factura generada exitosamente: {
  id: "...",
  invoiceNumber: "INV-202510-1234",
  date: {
    _seconds: 1234567890,
    _nanoseconds: 123456789
  },
  customer: {...},
  items: [...],
  // ...
}
```

### 4. Verificar Datos

En la consola, ejecuta:
```javascript
// Ver la factura generada
console.log('Factura:', window['ng'].getComponent(document.querySelector('app-checkout')).generatedInvoice);
```

## 🔍 Posibles Problemas

### Problema 1: Factura es undefined

**Síntoma:** `generatedInvoice` es `undefined` o `null`

**Causa:** El backend no está devolviendo la factura o hay un error en la petición

**Solución:**
1. Verificar que el backend esté corriendo
2. Verificar la consola del backend para errores
3. Verificar la pestaña Network en el navegador

### Problema 2: Factura tiene datos pero no se muestran

**Síntoma:** `generatedInvoice` tiene datos pero los campos están vacíos

**Causa:** Los timestamps de Firestore no se están convirtiendo correctamente

**Solución:** Ya implementada con el método `formatDate()`

### Problema 3: Error de CORS

**Síntoma:** Error en la consola: "blocked by CORS policy"

**Causa:** El backend no permite peticiones desde el frontend

**Solución:**
1. Verificar que el backend tenga `app.use(cors())` en `index.js`
2. Reiniciar el backend

### Problema 4: Error 404

**Síntoma:** Error: "404 Not Found" al generar factura

**Causa:** La URL del API es incorrecta

**Solución:**
1. Verificar `window.env.API_URL` en la consola
2. Debe ser: `http://localhost:3000/api`
3. Si no, recargar la página con Ctrl + Shift + R

## 🛠️ Soluciones Rápidas

### Solución 1: Recargar Todo

```bash
# Terminal 1: Reiniciar backend
cd backend
# Ctrl + C para detener
npm run dev

# Terminal 2: Reiniciar frontend  
cd frontend/tienda-ropa
# Ctrl + C para detener
npm start
```

### Solución 2: Limpiar Caché

1. En el navegador: Ctrl + Shift + Delete
2. Seleccionar "Caché" y "Cookies"
3. Hacer clic en "Borrar datos"
4. Recargar la página: Ctrl + Shift + R

### Solución 3: Verificar Backend

```bash
# Probar endpoint de facturas
curl http://localhost:3000/api/invoices
```

Debería devolver una lista de facturas o array vacío.

## 📋 Checklist de Verificación

- [ ] Backend corriendo en puerto 3000
- [ ] Frontend corriendo en puerto 4200
- [ ] Consola del navegador abierta (F12)
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores en la consola del backend
- [ ] `window.env.API_URL` es `http://localhost:3000/api`
- [ ] Página recargada con Ctrl + Shift + R

## 🎯 Qué Buscar en la Consola

### Logs Esperados (Buenos)

```
🔧 Modo Desarrollo: Conectando a http://localhost:3000/api
Enviando datos de factura: {...}
Factura generada exitosamente: {...}
```

### Errores Comunes (Malos)

```
❌ Error: Http failure response for https://momentos-con-amor.onrender.com/...
   → Solución: Verificar window.env.API_URL

❌ Error: 404 Not Found
   → Solución: Verificar que el backend esté corriendo

❌ Error: blocked by CORS policy
   → Solución: Verificar CORS en el backend

❌ Error: Cannot read property 'name' of undefined
   → Solución: La factura no tiene datos del cliente
```

## 🔧 Comandos de Debug

### En la Consola del Navegador

```javascript
// Ver URL del API
console.log('API URL:', window.env.API_URL);

// Ver factura generada
const component = window['ng'].getComponent(document.querySelector('app-checkout'));
console.log('Factura:', component.generatedInvoice);

// Ver items del carrito
console.log('Carrito:', component.cartItems);

// Ver formulario
console.log('Formulario:', component.checkoutForm.value);
```

### En la Terminal del Backend

```bash
# Ver logs en tiempo real
cd backend
npm run dev

# Deberías ver:
# Firebase inicializado con credenciales de servicio.
# Servidor corriendo en puerto 3000
# Entorno: development
```

## 📞 Siguiente Paso

**Por favor, comparte:**

1. **Captura de pantalla de la consola del navegador** (F12 → Console)
2. **Logs del backend** (lo que aparece en la terminal)
3. **Pestaña Network** (F12 → Network → filtrar por "invoices")

Con esta información podré identificar exactamente dónde está el problema.

---

## 🎯 Solución Temporal

Si necesitas que funcione YA, puedes:

1. **Recargar la página** con Ctrl + Shift + R
2. **Limpiar el carrito** y agregar productos nuevamente
3. **Intentar de nuevo** el checkout

A veces el problema se resuelve simplemente recargando todo.
