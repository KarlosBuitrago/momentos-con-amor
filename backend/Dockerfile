# Backend Dockerfile para Render
FROM node:18-alpine

# Instalar dependencias necesarias para bcrypt
RUN apk add --no-cache python3 make g++

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json ./
COPY package-lock.json ./

# Instalar dependencias de producción
RUN npm install --production

# Copiar el código fuente
COPY . .

# Exponer el puerto (Render usa la variable PORT dinámica)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
