---
inclusion: manual
---

# Formato de Moneda - Pesos Colombianos (COP)

## Configuración Actual

Todos los precios en la aplicación se muestran en **Pesos Colombianos (COP)** con el siguiente formato:

```typescript
{{ precio | currency:'COP':'symbol-narrow':'1.0-0' }}
```

### Parámetros del Formato

- `'COP'`: Código de moneda (Peso Colombiano)
- `'symbol-narrow'`: Muestra el símbolo de la moneda ($) en lugar del código "COP"
- `'1.0-0'`: Formato numérico
  - `1`: Mínimo 1 dígito entero
  - `0`: Mínimo 0 decimales
  - `0`: Máximo 0 decimales (sin centavos)

### Ejemplo de Salida

```
$58,000  (en lugar de €58,000 o 58000.00)
```

## Componentes Actualizados

Los siguientes componentes usan el formato COP:

### Páginas de Productos
- ✅ `product-catalog.component.html` - Catálogo de muñecos
- ✅ `crochet-materials.component.html` - Página de materiales
- ✅ `crochet-dolls.component.html` - Página de muñecos
- ✅ `courses.component.html` - Página de cursos
- ✅ `product-detail.component.ts` - Detalle de producto

### Carrito y Checkout
- ✅ `shopping-cart.component.html` - Carrito de compras
- ✅ `checkout.component.html` - Página de pago

## Cambios Realizados

Se reemplazó el formato anterior:
```typescript
{{ precio | currency:'EUR' }}
```

Por el formato actual:
```typescript
{{ precio | currency:'COP':'symbol-narrow':'1.0-0' }}
```

### Diferencia entre 'symbol' y 'symbol-narrow'

- `'symbol'`: Muestra "COP" (código de moneda)
- `'symbol-narrow'`: Muestra "$" (símbolo de pesos) ✓ **Formato actual**

## Verificación

Para verificar que todos los precios se muestran correctamente:

1. Navegar a cada página de productos
2. Verificar que los precios muestren el símbolo `$` (no `€`)
3. Verificar que no se muestren decimales
4. Verificar que los números tengan separadores de miles (comas)

### Ejemplo de Precios Correctos

- Muñeco: $58,000
- Material: $35,000
- Curso: $120,000

### Ejemplo de Precios Incorrectos (antiguos)

- ❌ €58,000
- ❌ 58000
- ❌ $58,000.00
