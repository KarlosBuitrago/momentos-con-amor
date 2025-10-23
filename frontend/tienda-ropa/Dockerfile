# Frontend Dockerfile para Render
# Etapa 1: Build de la aplicación Angular
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY . .

# Build de producción
RUN npm run build

# Etapa 2: Servidor con SSR
FROM node:18-alpine

WORKDIR /app

# Copiar los archivos compilados desde la etapa de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Exponer el puerto (Render usa la variable PORT dinámica)
EXPOSE ${PORT:-4000}

# Comando para iniciar el servidor SSR
CMD ["npm", "run", "serve:ssr:tienda-ropa"]
