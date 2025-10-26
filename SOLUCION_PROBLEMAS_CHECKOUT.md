# 🔧 Solución de Problemas en el Checkout

## ✅ Problemas Resueltos

### 1. Redirección al Login al Proceder al Pago

**Problema:** Al hacer clic en "Proceder al pago" desde el carrito, el sistema redirigía al login en lugar de ir directamente al checkout.

**Causa:** El componente `shopping-cart.component.ts` tenía una validación que verificaba si el usuario estaba autenticado antes de permitir el checkout.

**Solución:** Se eliminó la validación de autenticación para permitir **compras como invitado**.

**Código anterior:**
```typescript
checkout(): void {
  if (this.isAuthenticated) {
    this.router.navigate(['/checkout']);
  } else {
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: '/checkout' }
    });
  }
}
```

**Código nuevo:**
```typescript
checkout(): void {
  // Permitir checkout sin autenticación (compra como invitado)
  this.router.navigate(['/checkout']);
}
```

---

### 2. Error al Generar Factura

**Problema:** Al completar el formulario de checkout y hacer clic en "Generar Factura", aparecía el error: "Error al generar la factura. Por favor, inténtalo de nuevo."

**Causa:** El backend no estaba corriendo, por lo que el frontend no podía conectarse al API.

**Solución:** Iniciar el servidor backend.

---

## 🚀 Cómo Iniciar los Servidores

### Backend (Puerto 3000)

```bash
cd backend
npm run dev
```

**Verificar que esté corriendo:**
```bash
curl http://localhost:3000
```

**Respuesta esperada:**
```json
{"message":"API de Tienda de muñecos funcionando correctamente"}
```

---

### Frontend (Puerto 4200)

```bash
cd frontend/tienda-ropa
npm start
```

**Verificar que esté corriendo:**
Abrir en el navegador: http://localhost:4200

---

## 🔍 Verificar Conexión Frontend-Backend

### Prueba 1: Verificar API desde el navegador

Abrir en el navegador:
```
http://localhost:3000/api/products
```

Debería mostrar la lista de productos en formato JSON.

### Prueba 2: Probar generación de factura

```bash
curl -X POST http://localhost:3000/api/invoices/generate \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "1234567890",
      "address": "Test Address",
      "city": "Bogota",
      "postalCode": "110111"
    },
    "items": [{
      "productId": "test123",
      "name": "Test Product",
      "quantity": 1,
      "unitPrice": 50000,
      "subtotal": 50000
    }],
    "paymentMethod": "efectivo",
    "userId": "guest"
  }'
```

Debería devolver una factura generada con un ID.

---

## 🐛 Solución de Problemas Comunes

### Error: "address already in use 0.0.0.0:3000"

**Causa:** Ya hay un proceso usando el puerto 3000.

**Solución en Windows:**

1. Encontrar el proceso:
```bash
netstat -ano | findstr :3000
```

2. Matar el proceso (reemplazar PID con el número obtenido):
```bash
taskkill /F /PID <PID>
```

3. Reiniciar el backend:
```bash
cd backend
npm run dev
```

---

### Error: "Cannot connect to backend"

**Verificar:**

1. ✅ Backend está corriendo en puerto 3000
2. ✅ Frontend está corriendo en puerto 4200
3. ✅ No hay firewall bloqueando las conexiones
4. ✅ La URL del API en `environment.ts` es correcta:
   ```typescript
   apiUrl: 'http://localhost:3000/api'
   ```

---

### Error: "Firebase not initialized"

**Verificar:**

1. ✅ Archivo `.env` existe en `backend/`
2. ✅ Variable `GOOGLE_APPLICATION_CREDENTIALS` está configurada
3. ✅ Archivo de credenciales de Firebase existe

**Archivo `.env` debe contener:**
```env
GOOGLE_APPLICATION_CREDENTIALS=./react-firebase-dbc76-firebase-adminsdk-z2n37-911e39435e.json
```

---

## 📋 Checklist de Inicio

Antes de probar el checkout, verificar:

- [ ] Backend corriendo en http://localhost:3000
- [ ] Frontend corriendo en http://localhost:4200
- [ ] API responde en http://localhost:3000/api/products
- [ ] Firebase está conectado (ver logs del backend)
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores en la consola del backend

---

## 🎯 Flujo Completo del Checkout

### 1. Agregar Productos al Carrito
- Navegar a http://localhost:4200/productos
- Hacer clic en "Agregar al carrito"
- Verificar que aparezca en el carrito

### 2. Ir al Carrito
- Hacer clic en el icono del carrito
- Verificar que los productos estén listados
- Verificar el total

### 3. Proceder al Pago
- Hacer clic en "Proceder al pago"
- **Ahora va directamente al checkout** (sin pedir login)

### 4. Completar Formulario
- Llenar todos los campos requeridos:
  - Nombre completo
  - Email
  - Teléfono
  - Dirección
  - Ciudad
  - Código postal
  - Método de pago

### 5. Generar Factura
- Hacer clic en "Generar Factura"
- **Debe mostrar la factura generada** (no error)
- Verificar que aparezca:
  - Número de factura
  - Datos del cliente
  - Lista de productos
  - Total

### 6. Confirmar Pago
- Hacer clic en "✓ Confirmar Pago"
- Debe mostrar mensaje de éxito
- Debe enviar email al cliente (si está configurado)
- Debe redirigir a "Mis Pedidos"

---

## 🎊 Resultado Final

Ahora el sistema permite:

✅ **Compras como invitado** - No requiere login
✅ **Generación de facturas** - Backend funcionando correctamente
✅ **Descarga de PDF** - Factura en formato PDF
✅ **Email automático** - Confirmación por email (si está configurado)
✅ **Flujo completo** - Desde carrito hasta confirmación

---

## 📞 Soporte

Si sigues teniendo problemas:

1. Verificar logs del backend en la consola
2. Verificar consola del navegador (F12)
3. Verificar que ambos servidores estén corriendo
4. Reiniciar ambos servidores
5. Limpiar caché del navegador (Ctrl + Shift + Delete)

---

## 🔄 Comandos Rápidos

**Iniciar todo:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend/tienda-ropa
npm start
```

**Verificar estado:**
```bash
# Backend
curl http://localhost:3000

# Frontend
# Abrir http://localhost:4200 en el navegador
```

**Detener todo:**
```bash
# Presionar Ctrl + C en ambas terminales
```

---

¡Ahora el checkout debería funcionar perfectamente! 🎉
