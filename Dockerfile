# Build frontend
FROM node:18 as frontend-builder
WORKDIR /app
COPY client/package.json client/package-lock.json ./
RUN npm install --legacy-peer-deps
COPY client .
WORKDIR /app/client
RUN npm run build

# Setup backend
FROM node:18
WORKDIR /app
COPY server/package.json server/package-lock.json ./
RUN npm install --production
COPY server .

# Copy built frontend
COPY --from=frontend-builder /app/build ./public

# Environment variables
ENV NODE_ENV=production
ENV PORT=5555

EXPOSE 5555
CMD ["node", "index.js"]