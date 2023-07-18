# 1. 构建基础镜像
FROM node:18-alpine as base
#纯净版镜像

ENV APP_PATH=/app

WORKDIR $APP_PATH

COPY . .

# 安装 corepack 依赖
RUN corepack enable

RUN pnpm install

RUN pnpm generate

# 3. 基于基础镜像进行最终构建
FROM nginx

COPY --from=base /app/hexo-dist /usr/share/nginx/html