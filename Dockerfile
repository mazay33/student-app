FROM node:lts as build-stage
WORKDIR /nuxtapp
COPY . .
RUN npm install -g pnpm \
    && pnpm install \
    && pnpm build \
    && pnpm store prune \
    && rm -rf /root/.npm /root/.pnpm-store

FROM node:lts as prod-stage
WORKDIR /nuxtapp
COPY --from=build-stage /nuxtapp/.output/  ./.output/
CMD [ "node", ".output/server/index.mjs" ]
