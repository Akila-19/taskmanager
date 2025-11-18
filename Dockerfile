# =======================
# Stage 1: Build
# =======================
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package.json first and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# =======================
# Stage 2: Production
# =======================
FROM node:18-alpine
WORKDIR /app

# Add non-root user
RUN adduser -D appuser
USER appuser

# Copy files from builder stage
COPY --from=builder /app .

# Expose port
EXPOSE 3000
CMD ["node", "main.js"]
