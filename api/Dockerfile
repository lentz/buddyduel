FROM node:22-alpine

WORKDIR /app

COPY package*.json .

RUN npm ci

EXPOSE 9229

CMD ["npx", "tsx", "watch", "--inspect=0.0.0.0", "./src/server.ts"]
