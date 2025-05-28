# ---- Builder ----
FROM node:20-slim AS builder

WORKDIR /app
RUN corepack enable

# Copy lockfile, manifest, and Yarn internals for cache
COPY package.json yarn.lock ./
COPY .yarn .yarn
COPY .yarnrc.yml ./

# Non-sensitive build time env vars
COPY .env .env

# Install deps
RUN yarn install --immutable

# Copy source code *after* install (this avoids blowing away .yarn stuff)
COPY . .

RUN yarn build-ssr

# ---- Production ----
FROM node:20-slim

WORKDIR /app
RUN corepack enable

# Copy only SSR build output and necessary files
COPY --from=builder /app/dist/ssr ./dist/ssr
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./

# Only install prod deps (and only in root)
RUN yarn install --immutable

EXPOSE 52002

CMD ["node", "dist/ssr/index.js"]
