FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV AUTHENTIK_ISSUER=${AUTHENTIK_ISSUER}
ENV AUTHENTIK_CLIENT_ID=${AUTHENTIK_CLIENT_ID}
ENV AUTHENTIK_CLIENT_SECRET=${AUTHENTIK_CLIENT_SECRET}

COPY --from=builder /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
