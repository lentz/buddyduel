FROM node:18.17.1

WORKDIR /app

COPY package.json package-lock.json .

RUN npm install

EXPOSE 9229

CMD ["./node_modules/.bin/tsx", "--watch", "--inspect=0.0.0.0", "./api/src/server.ts"]
