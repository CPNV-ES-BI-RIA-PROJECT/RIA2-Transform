# Stage 1: Build + Install dependencies (including dev)
FROM node:20-alpine AS builder

# Labels
LABEL org.opencontainers.image.title="ria2-transform-orchestrator"
LABEL org.opencontainers.image.description="ria2-transform-orchestrator"
LABEL org.opencontainers.image.source="https://github.com/cpnv-es-bi-ria/ria2-transform-orchestrator"
LABEL org.opencontainers.image.documentation="https://github.com/cpnv-es-bi-ria/ria2-orchestrator#readme"
LABEL org.opencontainers.image.version="1.0.1"

# Set working directory
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy package files and tsconfig
COPY package.json pnpm-lock.yaml* tsconfig.json ./

# Install all dependencies (including dev)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY src ./src

# Compile TypeScript to /dist
RUN pnpm exec tsc

# Optional: Run tests (exit if failing)
# RUN pnpm exec jest --ci

# Stage 2: Production
FROM node:20-alpine AS prod

WORKDIR /usr/src/app

# Copy only production dependencies
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copy compiled code
COPY --from=builder /usr/src/app/dist ./dist

# Set NODE_ENV
ENV NODE_ENV=production

# Expose port from env variable (default 3000)
EXPOSE ${PORT:-3000}

# Start server with dotenv
CMD ["node", "dist/main/server.js"]