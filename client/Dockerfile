FROM node:24-alpine

WORKDIR /app

COPY package*.json .

RUN npm ci

EXPOSE 4200

CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]
