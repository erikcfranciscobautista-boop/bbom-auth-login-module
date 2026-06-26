```Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copiamos manifiestos e instalamos dependencias completas
COPY package*.json ./
RUN npm install

# Copiamos el resto del código (incluyendo tests y tsconfigs)
COPY . .

EXPOSE 3000

# Por defecto dejamos que levante el playground de desarrollo
CMD ["npm", "run", "start:test:dev"]
```