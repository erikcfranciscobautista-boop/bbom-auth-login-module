# --- ETAPA 1: BUILDER ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY . /app
RUN npm cache clean --force
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "localhost"]
RUN echo " DOCKERFILE LOGGER Exit"