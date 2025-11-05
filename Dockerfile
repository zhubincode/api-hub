# 使用官方 Node.js 18 Alpine 镜像
FROM node:18-alpine

# 切换到国内镜像源（阿里云，可选）
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories || true

# 设置工作目录
WORKDIR /app

# 安装必要的系统依赖（curl 用于健康检查）
RUN apk add --no-cache libc6-compat curl

# 复制包管理文件
COPY package.json package-lock.json* yarn.lock* ./

# 安装依赖（优先使用 npm ci）
RUN if [ -f package-lock.json ]; then \
      npm ci --omit=dev=false; \
    elif [ -f yarn.lock ]; then \
      yarn install --frozen-lockfile; \
    else \
      npm install; \
    fi

# 复制配置与源码
COPY next.config.js postcss.config.js tsconfig.json ./
COPY tailwind.config.ts ./
COPY app ./app
COPY pages ./pages
COPY components ./components
COPY services ./services
COPY public ./public
COPY README.md ./

# 构建
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN if [ -f yarn.lock ]; then \
      yarn build; \
    else \
      npm run build; \
    fi

# 运行时环境
ENV PORT=9530
ENV HOSTNAME="0.0.0.0"
EXPOSE 9530

# 以非 root 用户运行
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs && chown -R nextjs:nodejs /app
USER nextjs

# 启动应用（直接指定端口 9530）
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "9530"]
