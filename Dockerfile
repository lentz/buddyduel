FROM node:16

WORKDIR /app

COPY package*.json .
RUN npm ci

COPY client client
COPY api api

ENV AUTH0_DOMAIN=buddyduel.us.auth0.com
ENV BASE_URL=https://buddyduel.net
ENV DATABASE_NAME=prod
ENV NODE_ENV=production
ENV PORT=8080

RUN npm run build-api
RUN npm run build-client-prod

EXPOSE 8080

CMD ["npm", "start"]
