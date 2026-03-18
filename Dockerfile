# Stage 1: Build
FROM node:20-alpine AS builder

# Labels
LABEL org.opencontainers.image.title="ria2-transform"
LABEL org.opencontainers.image.description="RIA data transformation service"
LABEL org.opencontainers.image.source="https://github.com/cpnv-es-bi-ria/ria2-transform"
LABEL org.opencontainers.image.documentation="https://github.com/cpnv-es-bi-ria/ria2-transform#readme"
LABEL org.opencontainers.image.version="1.0.1"

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies with pnpm
COPY package.json pnpm-lock.yaml* tsconfig.json ./
RUN npm install -g pnpm
RUN pnpm install

# Copy source code
COPY src ./src

# Compile TypeScript
RUN pnpm exec tsc

# Stage 2: Production
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy only what we need for production
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Expose the server port
EXPOSE 3000

# Start the server
CMD ["node", "dist/server.js"]