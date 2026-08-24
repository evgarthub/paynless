# Build frontend
FROM oven/bun:alpine AS frontend-build
WORKDIR /app/web
COPY web/package.json web/bun.lock* ./
RUN bun install --frozen-lockfile
COPY web/ .
RUN bun run build

# Production
FROM oven/bun:alpine
WORKDIR /app

COPY server/package.json server/bun.lock* ./server/
WORKDIR /app/server
RUN bun install --frozen-lockfile

COPY server/ .
RUN mkdir -p /app/data

COPY --from=frontend-build /app/web/dist /app/server/public

ENV NODE_ENV=production
ENV DB_PATH=/app/data/paynless.db
ENV PORT=3000

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
