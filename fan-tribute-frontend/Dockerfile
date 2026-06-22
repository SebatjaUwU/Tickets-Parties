# ---- Development ----
FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 4200
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--poll", "2000"]

# ---- Build ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Production (Nginx) ----
FROM nginx:alpine AS production
COPY --from=builder /app/dist/fan-tribute-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
