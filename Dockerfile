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

# Override default nginx config to support Vue Router history mode
RUN rm /etc/nginx/conf.d/default.conf && \
    cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
  listen       80;
  server_name  _;
  root         /usr/share/nginx/html;
  index        index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
EOF

# Copy built static assets from “build” stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 and run nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
