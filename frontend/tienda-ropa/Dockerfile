# Frontend Dockerfile para Render
# Etapa 1: Build de la aplicación Angular
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json ./
COPY package-lock.json ./

# Instalar todas las dependencias (necesarias para el build)
RUN npm install

# Copiar el código fuente
COPY . .

# Build de producción
RUN npm run build

# Etapa 2: Servidor estático con Express
FROM node:18-alpine

WORKDIR /app

# Instalar solo express para servir archivos estáticos
RUN npm install express

# Copiar los archivos compilados desde la etapa de build
COPY --from=builder /app/dist/tienda-ropa/browser ./dist

# Crear servidor simple
RUN echo 'const express = require("express"); \
const path = require("path"); \
const app = express(); \
const PORT = process.env.PORT || 4000; \
app.use(express.static(path.join(__dirname, "dist"))); \
app.get("/*", (req, res) => { \
  res.sendFile(path.join(__dirname, "dist", "index.html")); \
}); \
app.listen(PORT, "0.0.0.0", () => { \
  console.log(`Server running on port ${PORT}`); \
});' > server.js

# Exponer el puerto
EXPOSE 4000

# Comando para iniciar el servidor
CMD ["node", "server.js"]
