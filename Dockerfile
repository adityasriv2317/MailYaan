# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build Next.js (works with Pages Router too)
RUN npm run build

# Expose Next.js default port
EXPOSE 3000

# Start the Next.js app (production mode)
CMD ["npm", "start"]
