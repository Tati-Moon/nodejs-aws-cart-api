FROM node:20-alpine AS dev
WORKDIR /app
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
USER node

FROM node:20-alpine AS build
WORKDIR /app
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=dev /app/node_modules ./node_modules
COPY --chown=node:node . .
RUN npm run build

ENV NODE_ENV=prod
RUN npm ci --only=prod && npm cache clean --force

USER node

FROM node:20-alpine AS prod
WORKDIR /app
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist

EXPOSE 4000

CMD [ "node", "dist/main.lambda.js" ]