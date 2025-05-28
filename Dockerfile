# -----------------------
# Step 1: Build React app
# -----------------------
FROM node:20-alpine AS builder


# Use a smaller image (alpine) to reduce base image size

# Set working directory
WORKDIR /app

# Install dependencies using cache optimization
COPY package.json package-lock.json ./

# Install only production dependencies if needed (optional)
RUN npm ci --legacy-peer-deps

# Copy rest of the source code
COPY . .

# Build the React app
RUN npm run build


# -----------------------
# Step 2: Serve with Nginx
# -----------------------
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy build output from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/

# Expose port 80
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
