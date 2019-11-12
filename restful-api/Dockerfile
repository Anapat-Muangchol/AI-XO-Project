FROM node:8.7-alpine

WORKDIR /app/rest-service

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]