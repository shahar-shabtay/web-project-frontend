# Step 1: Build the app
FROM node:23 AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the source code and build the app
COPY . ./
RUN npm run build

# Step 2: Set up Nginx for serving static files
FROM nginx:alpine

# Copy Nginx configuration file
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copy the build files to the Nginx HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]