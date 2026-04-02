# Stage 1: Build
FROM node:20-alpine AS builder

# Labels
LABEL org.opencontainers.image.title="ria2-transform-bucket-adapter"
LABEL org.opencontainers.image.description="ria2-transform-bucket-adapter"
LABEL org.opencontainers.image.source="https://github.com/cpnv-es-bi-ria/ria2-transform-bucket-adapter"
LABEL org.opencontainers.image.documentation="https://github.com/cpnv-es-bi-ria/ria2-bucket-adapter#readme"
LABEL org.opencontainers.image.version="1.0.1"

# Set working directory
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy package files and tsconfig
COPY package.json pnpm-lock.yaml* tsconfig.json ./

# Install all dependencies (dev + prod)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY src ./src

# Compile TypeScript to /dist
RUN pnpm exec tsc

# Optional: Run tests (uncomment to fail build if tests fail)
# RUN pnpm exec jest --ci

# Stage 2: Production image
FROM node:20-alpine AS prod

WORKDIR /usr/src/app

# Copy only production dependencies from builder
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copy compiled code
COPY --from=builder /usr/src/app/dist ./dist


# Set NODE_ENV
ENV NODE_ENV=production

# Expose server port
EXPOSE ${PORT:-3000}

# Start the server
CMD ["node", "dist/main/server.js"]