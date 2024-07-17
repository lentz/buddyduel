FROM node:22

WORKDIR /app

COPY package*.json .

RUN npm install

EXPOSE 9229

CMD ["npx", "tsx", "watch", "--inspect=0.0.0.0", "./src/server.ts"]
