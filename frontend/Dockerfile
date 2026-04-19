# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Argumento para que la URL del backend se inyecte en el cliente de Next.js
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package*.json ./
RUN npm install --frozen-lockfile

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Solo copiamos lo necesario para correr la app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./

EXPOSE 3000

# Railway usa la variable PORT
CMD ["sh", "-c", "npm run start -- -p ${PORT:-3000}"]
