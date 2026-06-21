# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos los package.json para instalar TODAS las dependencias necesarias para compilar
COPY package*.json ./

# Limpiamos caché e instalamos todo (incluyendo devDependencies como TypeScript)
RUN npm cache clean --force && npm install --no-audit --no-fund

COPY . .

# Compilamos el código TypeScript
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Instalamos ÚNICAMENTE las dependencias de producción (fastify, zod, jsonwebtoken)
# Usamos --omit=dev para que no pida obligatoriamente un package-lock.json
RUN npm install --omit=dev

# Nos traemos el código compilado y los scripts desde el builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/login', { method: 'POST', headers: { 'Content-Type': 'application/json' } }, () => process.exit(0)).on('error', () => process.exit(1)).end('{\"username\":\"x\",\"password\":\"x\"}')"

CMD ["npm", "run", "start:test"]