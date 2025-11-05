#!/bin/bash

# API Hub 部署脚本（端口 9530）

set -e

# 快速部署（使用构建缓存）
FAST_DEPLOY=false
if [ "$1" = "--fast" ] || [ "$1" = "-f" ]; then
    FAST_DEPLOY=true
    echo "⚡ 快速部署模式"
fi

echo "🚀 开始部署 API Hub..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

echo "🛑 停止现有服务..."
docker-compose down 2>/dev/null || true

echo "🔨 构建镜像..."
if [ "$FAST_DEPLOY" = true ]; then
    echo "⚡ 使用缓存快速构建..."
    docker-compose build
else
    # 总是使用缓存构建（Docker 会自动判断哪些层需要重建）
    echo "📦 智能构建（利用 Docker 层缓存）..."
    docker-compose build
fi

echo "🚀 启动服务..."
docker-compose up -d

echo "⏳ 等待服务启动..."
sleep 10

echo "🔍 检查服务状态..."
if docker-compose ps | grep -q "Up"; then
    echo "✅ 服务启动成功!"
    echo "🌐 访问地址: http://localhost:9530"
    echo "🩺 健康检查: http://localhost:9530/api/health"
    echo ""
    echo "📋 最新日志:"
    docker-compose logs --tail=10 api-hub
else
    echo "❌ 服务启动失败!"
    echo "📋 错误日志:"
    docker-compose logs api-hub
    exit 1
fi

echo "✨ 部署完成!"
echo "💡 使用 'docker-compose logs -f' 查看实时日志"
echo "💡 使用 'docker-compose down' 停止服务"
echo "💡 使用 './deploy.sh --fast' 进行快速部署（仅样式修改时推荐）"
