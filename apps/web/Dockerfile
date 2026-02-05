FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN npm install -g turbo
WORKDIR /app
COPY . .
RUN turbo prune web --docker

FROM node:20-alpine AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First copy package.json and lockfile to install dependencies
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN npx turbo run build --filter=web...

FROM node:20-alpine AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/web/next.config.js .
COPY --from=installer /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nestjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nestjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nestjs:nodejs /app/apps/web/public ./apps/web/public

CMD ["node", "apps/web/server.js"]
