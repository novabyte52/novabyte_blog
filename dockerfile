# ---- deps/build ----
FROM node:20-slim AS builder
WORKDIR /app
RUN corepack enable

# Copy yarn core + lockfiles FIRST for caching
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn

# Install deps (cached)
RUN yarn install --immutable

# Copy source and build
COPY . .
RUN yarn build-ssr

# ---- runtime ----
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable

# ⬇️ ship EXACT deps + yarn metadata from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.yarnrc.yml ./
COPY --from=builder /app/.yarn ./.yarn

# App bits
COPY --from=builder /app/dist/ssr ./dist/ssr
COPY --from=builder /app/package.json ./package.json

EXPOSE 52002
CMD ["node", "dist/ssr/index.js"]
