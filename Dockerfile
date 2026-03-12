# Stage 1: build
FROM node:20-alpine AS builder

# Labels
LABEL org.opencontainers.image.title="ria2-transform"
LABEL org.opencontainers.image.description="RIA data transformation service"
LABEL org.opencontainers.image.source="https://github.com/cpnv-es-bi-ria/ria2-transform"
LABEL org.opencontainers.image.documentation="https://github.com/cpnv-es-bi-ria/ria2-transform#readme"
LABEL org.opencontainers.image.version="1.0.1"

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
RUN npm install -g pnpm
RUN pnpm install

COPY tsconfig.json ./
COPY src ./src

RUN npx tsc

# Stage 2: production
FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]