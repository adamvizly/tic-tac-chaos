# Use a Node.js image to build the frontend
FROM node:16 as build

WORKDIR /app

# Accept build argument for API URL
ARG REACT_APP_API_URL=http://localhost:8000
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

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

# Simple nginx config for SPA
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ { expires 1y; } location / { try_files $uri /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
