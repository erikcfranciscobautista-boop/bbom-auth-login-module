FROM node:20-alpine
WORKDIR /app
COPY . /app
RUN npm cache clean --force
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "localhost"]
RUN echo " DOCKERFILE LOGGER Exit"