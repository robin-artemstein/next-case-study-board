# Stage 1: Build dependencies & Next.js
FROM node:22-alpine AS builder

# Install dependencies for native builds (sharp, etc.)
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy package files first (better cache for Docker)
COPY package.json yarn.lock ./

# Install all dependencies (including dev)
RUN yarn install --frozen-lockfile

# Copy project files
COPY . .

# Build Next.js app (creates .next folder)
RUN yarn build


# Stage 2: Production runtime
FROM node:22-alpine AS runner

# Install minimal tools
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy only production build output from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy .env file (consider using environment variables in production instead)
COPY .env .

# Expose default Next.js port
EXPOSE 3000

# Start Next.js with dumb-init (handles PID 1 correctly)
CMD ["dumb-init", "node", "server.js"]