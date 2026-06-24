# ---- Base ----
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps && cp -R node_modules /tmp/prod_node_modules
RUN npm ci --legacy-peer-deps

# ---- Development ----
FROM base AS development
COPY . .
CMD ["npm", "run", "start:dev"]

# ---- Build ----
FROM base AS builder
COPY . .
RUN npm run build

# ---- Production ----
FROM node:20-alpine AS production
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /tmp/prod_node_modules ./node_modules
COPY package.json ./
ENV NODE_ENV=production
USER node
EXPOSE 3000
CMD ["node", "dist/main"]
