FROM node:22-alpine

WORKDIR /app

COPY ./client/package*.json ./client/
RUN cd ./client && npm ci

COPY ./api/package*.json ./api/
RUN cd ./api && npm ci

COPY client client
COPY api api

ENV BASE_URL=https://buddyduel.fly.dev
ENV DATABASE_NAME=prod
ENV NODE_ENV=production
ENV PORT=8080

RUN cd ./api && \
  npm run build && \
  cd ../client && \
  npm run build:prod

EXPOSE 8080

CMD ["node", "./api/dist/server.js"]
