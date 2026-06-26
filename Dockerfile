# --- ETAPA 1: BUILDER ---
FROM node:20-alpine AS builder
RUN echo " DOCKERFILE LOGGER Building the application..."
WORKDIR /app
RUN echo " DOCKERFILE LOGGER Copying files to /app"
COPY . /app
RUN echo " DOCKERFILE LOGGER Cleaning npm cache"
RUN npm cache clean --force
RUN echo " DOCKERFILE LOGGER Installing dependencies"
RUN npm install
RUN echo " DOCKERFILE LOGGER Building the application"
EXPOSE 4010
RUN echo " DOCKERFILE LOGGER Running .... npm run localhost"
CMD ["npm", "run", "localhost"]
RUN echo " DOCKERFILE LOGGER Exit"