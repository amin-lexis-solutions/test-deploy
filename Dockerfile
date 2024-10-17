# Use Node.js LTS version
FROM node:lts-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Clean up and install dependencies
RUN rm -rf .next && \
    rm -rf node_modules && \
    yarn cache clean && \
    yarn install --frozen-lockfile

# Copy project files
COPY . .

# Build the Next.js app
RUN yarn build

# Start a new stage for a smaller production image
FROM node:lts-alpine

WORKDIR /app

# Copy necessary files from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

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
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Run the Next.js app
CMD ["yarn", "start"]
