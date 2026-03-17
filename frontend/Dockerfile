# Build stage
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# For production build, we need to handle the VITE_API_BASE_URL
# It can be set at build time or handled via Nginx reverse proxy
RUN npm run build

# Production stage
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
# Include custom nginx config for SPA routing if needed (though index.html is usually enough)

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
