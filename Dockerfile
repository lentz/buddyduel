FROM node:22-alpine AS base

##################
FROM base AS build

WORKDIR /app/api

COPY ./api/package*.json ./

RUN npm ci

COPY ./api ./

RUN npm run build

WORKDIR /app/client

COPY ./client/package*.json ./

RUN npm ci

COPY client ./

RUN npm run build:prod

##################
FROM base AS final

ENV BUDDYDUEL_URL=https://buddyduel.fly.dev
ENV CLIENT_DIST_PATH=/app/client/dist/buddyduel/browser
ENV DATABASE_NAME=prod
ENV NODE_ENV=production
ENV PORT=8080

WORKDIR /app/api

COPY ./api/package*.json ./
RUN npm ci

COPY --from=build /app/api/dist /app/api

WORKDIR  /app/client

COPY --from=build /app/client/dist ./dist

EXPOSE 8080

CMD ["node", "/app/api/server.js"]
