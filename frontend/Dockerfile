# Use a Node.js image to build the frontend
FROM node:16 as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY frontend/ .

# Build the frontend (Create React App outputs to 'build')
RUN npm run build

# Verify build succeeded
RUN test -d /app/build || (echo "Build failed - no /app/build directory found" && exit 1)

# Use a lightweight web server to serve the frontend
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# Configure Nginx with reverse proxy to backend
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # Serve static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Proxy WebSocket to backend
    location /ws/ {
        proxy_pass https://tic-tac-chaos-production.up.railway.app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host tic-tac-chaos-production.up.railway.app;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Proxy matchmaking API to backend
    location /matchmaking {
        proxy_pass https://tic-tac-chaos-production.up.railway.app;
        proxy_set_header Host tic-tac-chaos-production.up.railway.app;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SPA fallback
    location / {
        try_files $uri /index.html;
    }
}
EOF

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
