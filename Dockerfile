# ===========================
# 阶段 1: 依赖安装
# ===========================
FROM node:18-alpine AS deps
WORKDIR /app

# 使用阿里云镜像源加速（中国大陆）
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 安装必要的系统依赖
RUN apk add --no-cache libc6-compat

# 复制包管理文件
COPY package.json package-lock.json* yarn.lock* ./

# 配置 npm 使用淘宝镜像加速（中国大陆）
RUN npm config set registry https://registry.npmmirror.com

# 安装所有依赖（包含 devDependencies）
RUN if [ -f package-lock.json ]; then \
      npm ci; \
    elif [ -f yarn.lock ]; then \
      yarn install --frozen-lockfile; \
    else \
      npm install; \
    fi

# ===========================
# 阶段 2: 构建应用
# ===========================
FROM node:18-alpine AS builder
WORKDIR /app

# 从 deps 阶段复制依赖
COPY --from=deps /app/node_modules ./node_modules

# 复制配置与源码
COPY next.config.js postcss.config.js tsconfig.json ./
COPY tailwind.config.ts ./
COPY app ./app
COPY pages ./pages
COPY components ./components
COPY services ./services
COPY public ./public

# 构建应用
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN if [ -f yarn.lock ]; then \
      yarn build; \
    else \
      npm run build; \
    fi

# ===========================
# 阶段 3: 生产运行时
# ===========================
FROM node:18-alpine AS runner
WORKDIR /app

# 使用阿里云镜像源加速（中国大陆）
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 安装运行时依赖（添加 curl 用于健康检查）
RUN apk add --no-cache libc6-compat curl

# 设置生产环境
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=9530
ENV HOSTNAME="0.0.0.0"

# 复制必要的文件
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

# 复制构建产物
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 暴露端口
EXPOSE 9530

# 直接使用 root 用户启动应用
CMD ["node", "server.js"]
