# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker's cache
COPY package*.json ./

# Install dependencies. `npm ci` is faster and more reliable than `npm install`
RUN npm ci --legacy-peer-deps

# Copy the rest of the application source code
COPY . .

# Build the app for production
RUN npm run build

# Stage 2: Serve the production build with a lightweight Nginx server
FROM nginx:stable-alpine AS server

# Copy the custom Nginx configuration
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy the built assets from the builder stage to Nginx's web directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 to the host
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
