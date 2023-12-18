FROM node:18.17.1

WORKDIR /app

COPY package.json package-lock.json .

RUN npm install

EXPOSE 3000
EXPOSE 9229

CMD ["./node_modules/.bin/tsx", "--watch", "--inspect", "./api/src/server.ts"]
