# Comunicación Frontend-Backend

## Estado Actual

### ✅ Configuración Correcta

1. **URLs y Endpoints**
   - Frontend: `http://localhost:3000/api` (definido en `environment.ts`)
   - Backend: Puerto 3000 con rutas `/api/products`, `/api/auth`, `/api/orders`
   - CORS habilitado para permitir peticiones cross-origin

2. **Estructura de Datos**
   - Interfaces `Product` consistentes entre frontend y backend
   - Soporte para customizaciones, tags, imágenes, etc.

3. **Fallback Inteligente**
   - El frontend usa localStorage si el backend no responde
   - Productos de ejemplo se crean automáticamente en localStorage

### ✅ Problemas Resueltos

1. **Firebase Conectado a Firestore (Nube)** ✅
   - Backend conectado exitosamente a Firebase Firestore
   - Credenciales configuradas en: `backend/react-firebase-dbc76-firebase-adminsdk-z2n37-911e39435e.json`
   - Variable de entorno: `GOOGLE_APPLICATION_CREDENTIALS` configurada en `.env`
   - Los datos se guardan en la nube, no en `.local-data/`

2. **Lógica de Filtros Limpiada** ✅
   - Componente `ProductCatalogComponent` limpiado
   - Eliminada toda la lógica de filtrado huérfana
   - El componente ahora solo carga y muestra productos

3. **Backend Corriendo** ✅
   - Backend iniciado en http://localhost:3000
   - 3 productos de ejemplo creados en Firebase
   - API respondiendo correctamente

## Flujo de Comunicación

```
Frontend (Angular)
    ↓
ProductService.getProducts()
    ↓
HTTP GET → http://localhost:3000/api/products
    ↓
Backend (Express)
    ↓
productController.getAllProducts()
    ↓
Product.getAll() → Firebase Firestore
    ↓
Respuesta JSON con productos
    ↓
Frontend renderiza en products-grid
```

## Comandos para Probar la Comunicación

### 1. Iniciar Backend
```bash
cd backend
npm run dev
```

### 2. Iniciar Frontend
```bash
cd frontend/tienda-ropa
npm start
```

### 3. Poblar Base de Datos (opcional)
```bash
# Hacer POST a http://localhost:3000/api/products/seed
curl -X POST http://localhost:3000/api/products/seed
```

### 4. Verificar Productos
```bash
# Ver productos en el backend
curl http://localhost:3000/api/products
```

## Próximos Pasos Recomendados

1. **Decidir sobre los filtros:**
   - ¿Restaurar la UI de filtros?
   - ¿O limpiar el código TypeScript?

2. **Verificar Firebase:**
   - Asegurarse de que las credenciales estén configuradas
   - O aceptar usar el mock storage local

3. **Probar la comunicación:**
   - Iniciar ambos servidores
   - Verificar que los productos se carguen desde el backend
   - Revisar la consola del navegador para errores de red