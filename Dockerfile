# =======================
# Stage 1: Build
# =======================
FROM node:latest AS builder
WORKDIR /app

# Copy package.json first and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# =======================
# Stage 2: Production
# =======================
FROM node:latest
WORKDIR /app

# Copy files from builder stage
COPY --from=builder /app .

# =======================
# Intentional insecure practices for Trivy
# =======================
  # Security warning: running as root user
USER root     
# Exposing port (minor best-practice warning)       
EXPOSE 3000            
CMD ["node", "main.js"]
