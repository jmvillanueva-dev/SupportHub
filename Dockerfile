# Stage 1: Base
FROM node:18-alpine AS base
WORKDIR /app

# Instalar dependencias de compilación para better-sqlite3 y herramientas de red
RUN apk add --no-cache python3 make g++ iputils

# Stage 2: Dependencies
FROM base AS deps
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Stage 3: Builder
FROM base AS builder
WORKDIR /app

# Copiar dependencias
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build de Next.js
RUN npm run build

# Stage 4: Runner
FROM base AS runner
WORKDIR /app

# Variables de entorno
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src ./src
COPY --from=builder /app/pages ./pages
COPY --from=builder /app/styles ./styles
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/tailwind.config.js ./tailwind.config.js
COPY --from=builder /app/postcss.config.js ./postcss.config.js
COPY --from=builder /app/jsconfig.json ./jsconfig.json

# Crear directorio de datos con permisos
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app

# Cambiar al usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 3000

# Inicializar DB y arrancar servidor
CMD ["sh", "-c", "node src/infrastructure/database/init.js && npm start"]
