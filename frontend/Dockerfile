# ── Stage 1: Build ──
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first for layer caching
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy the rest of the source code
COPY . .

ARG VITE_API_URL
ARG VITE_GOOGLE_MAPS_API_KEY
ARG VITE_GOOGLE_MAPS_ID
ARG VITE_GOOGLE_CLIENT_ID

# Build the production bundle
RUN npm run build

# ── Stage 2: Production ──
# Using unprivileged NGINX image (runs as non-root user by default)
FROM nginxinc/nginx-unprivileged:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Port 8080 (non-root can't bind to ports below 1024)
EXPOSE 8080

# Start NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
