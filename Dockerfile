FROM node:20-alpine

WORKDIR /app

# 1. Copiamos los manifiestos
COPY package*.json ./

# 2. Instalamos dependencias limpiamente
RUN npm install

# 3. Copiamos todo el código fuente (incluyendo src/, test/ y tsconfigs)
COPY . .

EXPOSE 3000

# 4. Arranca el playground local leyendo directamente los archivos TS en caliente
CMD ["npm", "run", "start:test:dev"]