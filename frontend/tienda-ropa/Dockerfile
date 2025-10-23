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

# Instalar express versión compatible
RUN npm install express@4.18.2

# Copiar los archivos compilados desde la etapa de build
COPY --from=builder /app/dist/tienda-ropa/browser ./dist

# Copiar el servidor
COPY server.js ./

# Exponer el puerto
EXPOSE 4000

# Comando para iniciar el servidor
CMD ["node", "server.js"]
