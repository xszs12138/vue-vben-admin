FROM node:22-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_OPTIONS=--max-old-space-size=8192
ENV TZ=Asia/Shanghai
ENV CI=true

ARG VITE_GLOB_API_URL=/api
ARG VITE_BASE=/admin/

RUN corepack enable

WORKDIR /app

COPY . /app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  corepack prepare pnpm@11.2.2 --activate \
  && pnpm install --frozen-lockfile

RUN sed -i "s#VITE_GLOB_API_URL=.*#VITE_GLOB_API_URL=${VITE_GLOB_API_URL}#" apps/web-antdv-next/.env.production \
  && sed -i "s#VITE_BASE=.*#VITE_BASE=${VITE_BASE}#" apps/web-antdv-next/.env.production \
  && sed -i "s#VITE_COMPRESS=.*#VITE_COMPRESS=gzip#" apps/web-antdv-next/.env.production \
  && sed -i "s#VITE_PWA=.*#VITE_PWA=false#" apps/web-antdv-next/.env.production

RUN pnpm run build --filter=@vben/web-antdv-next

RUN echo "Builder Success 🎉"

FROM nginx:stable-alpine AS production

RUN echo "types { application/javascript js mjs; }" > /etc/nginx/conf.d/mjs.conf \
  && rm -rf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/apps/web-antdv-next/dist /usr/share/nginx/html
COPY --from=builder /app/scripts/deploy/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
