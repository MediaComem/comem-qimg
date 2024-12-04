# Builder image
# =============

FROM node:22.11.0-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma/ /app/prisma/
RUN npx prisma generate

COPY . .
RUN npm prune --production

# Production image
# ================

FROM node:22.11.0-alpine

ENV NODE_ENV=production \
    PORT=3000

LABEL org.opencontainers.image.authors="simon.oulevay@heig-vd.ch"

WORKDIR /app

RUN addgroup -S qimg && \
    adduser -D -G qimg -H -s /usr/bin/nologin -S qimg && \
    chown qimg:qimg /app

USER qimg:qimg

COPY docker/entrypoint /usr/local/bin/entrypoint
COPY --chown=qimg:qimg --from=builder /app /app

ENTRYPOINT ["/usr/local/bin/entrypoint"]
CMD ["node", "./bin/start.js"]

EXPOSE 3000
