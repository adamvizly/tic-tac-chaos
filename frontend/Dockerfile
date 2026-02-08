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

# Copy the nginx configuration
COPY frontend/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
