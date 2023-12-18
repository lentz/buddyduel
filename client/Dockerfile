FROM node:18.17.1

WORKDIR /app

COPY package.json package-lock.json .

RUN npm install

EXPOSE 4200

WORKDIR /app/client

CMD ["../node_modules/.bin/ng", "serve", "--host", "0.0.0.0"]
