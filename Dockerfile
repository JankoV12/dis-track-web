# 1) Build stage
FROM node:24-alpine AS build

WORKDIR /app

# Install deps based on package.json
COPY package*.json ./
RUN npm install

# Copy source & build
COPY . .
RUN npm run build

# 2) Production stage
FROM nginx:alpine

# Copy built static assets from “build” stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 and run nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
