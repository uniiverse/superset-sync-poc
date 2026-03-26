FROM docker.io/library/node:20-alpine@sha256:9b61ed13fef9ca689326f40c0c0b4da70e37a18712f200b4c66d3b44fd59d98e AS DEPENDENCIES
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN --mount=type=secret,id=npmrc,target=/app/.npmrc \
    --mount=type=cache,target=/root/.npm \
    npm install --no-fund --no-audit --loglevel verbose

FROM docker.io/library/node:20-alpine@sha256:9b61ed13fef9ca689326f40c0c0b4da70e37a18712f200b4c66d3b44fd59d98e AS DEVELOPMENT

WORKDIR /app

ENV GRPC_SERVER_REFLECTION_PATH=./node_modules/@universe/api/descriptor_set.bin

COPY --from=DEPENDENCIES /app/node_modules ./node_modules

COPY . .

CMD ["npm", "run", "dev"]

FROM docker.io/library/node:20-alpine@sha256:9b61ed13fef9ca689326f40c0c0b4da70e37a18712f200b4c66d3b44fd59d98e AS PRODUCTION

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=DEPENDENCIES /app/node_modules ./node_modules

COPY . .

USER nextjs

# gRPC service listens at 8080, express HTTP service listens at 8081.
EXPOSE 8080
EXPOSE 8081

CMD ["npm", "start"]
