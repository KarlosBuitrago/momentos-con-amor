#!/bin/bash

# Script para generar env.js con variables de entorno
# Se ejecuta durante el build en Render

cat > dist/tienda-ropa/browser/env.js << EOF
(function(window) {
  window.env = window.env || {};
  window.env.API_URL = '${API_URL:-https://momentos-con-amor.onrender.com/api}';
})(this);
EOF

echo "✅ env.js generado con API_URL=${API_URL:-https://momentos-con-amor.onrender.com/api}"
