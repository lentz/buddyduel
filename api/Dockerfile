FROM node:24-alpine

WORKDIR /app

COPY package*.json .

RUN npm ci

EXPOSE 9229

CMD ["node", "--watch", "--inspect=0.0.0.0", "./src/server.ts"]
