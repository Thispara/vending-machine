# Use Node.js official image
FROM node:20-slim AS base
WORKDIR /usr/src/app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy app source
COPY . .

# Expose port
EXPOSE 3000

# Start dev server
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]