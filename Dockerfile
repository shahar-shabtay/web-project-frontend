# Step 1: Use the official Node.js image as the base
FROM node:23-alpine AS build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the app's source code
COPY . .

# Step 6: Build the Vite app
RUN npm run build

# Step 7: Use an NGINX image to serve the built app
FROM nginx:alpine AS production

# Step 8: Copy your custom nginx.conf to the container
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Step 9: Copy the built files to NGINX's default directory
COPY --from=build /app/dist /usr/share/nginx/html

# Step 10: Expose the port NGINX will serve on
EXPOSE 80

# Step 11: Start NGINX
CMD ["nginx", "-g", "daemon off;"]