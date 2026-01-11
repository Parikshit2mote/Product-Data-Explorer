FROM node:20-bookworm

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Install Playwright browsers (chromium only to save space/time)
RUN npx playwright install --with-deps chromium

# Copy source
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 4000

# Start
CMD ["npm", "run", "start:prod"]
