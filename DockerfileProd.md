```Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copiamos manifiestos e instalamos dependencias completas
COPY package*.json ./
RUN npm install

# Copiamos el resto del código
COPY . .

# 🔥 Ejecutamos el build de TypeScript en la fase de construcción de la imagen
RUN npm run build

EXPOSE 3000

# 🚀 Cambiamos el comando por defecto para que corra el código JavaScript compilado
CMD ["node", "dist/index.js"]
```