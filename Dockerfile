# Use Node.js LTS version
FROM node:lts-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the Next.js app
RUN npm run build

# Start a new stage for a smaller production image
FROM node:lts-alpine

WORKDIR /app

# Copy necessary files from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Add non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set ownership of the app directory
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose the port Next.js runs on
EXPOSE 3000

# Set environment variables
# Use ENV instead of EXPOSE for environment variables
ENV API_URL=$API_URL
ENV API_SECRET=$API_SECRET
ENV ADMIN_PASS=$ADMIN_PASS

# Copy .env file if it exists
COPY .env .env

# Run the Next.js app
CMD ["npm", "start"]