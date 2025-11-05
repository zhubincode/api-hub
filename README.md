# 🚀 API Hub - 公司公共接口服务平台

一个基于 **Next.js 13 + TypeScript + Ant Design + TailwindCSS** 构建的现代化公共接口服务平台，用于统一管理和测试公司内部公共 API。

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-13.4.19-black" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5.6+-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/Ant%20Design-5.18+-1890ff" alt="Ant Design">
  <img src="https://img.shields.io/badge/Node.js-18.19+-green" alt="Node.js">
</p>

## ✨ 特性

- 🎨 **现代化 UI** - 基于 Ant Design + TailwindCSS，简洁专业，支持深色模式
- 📊 **实时监控** - 接口健康状态监控，响应时间可视化图表
- 🔍 **智能检测** - 支持多种 HTTP 方法，灵活配置超时、重试、证书校验等高级选项
- 💾 **历史记录** - 自动保存测试历史（最多 50 条），支持导出 JSON 数据
- 🌐 **代理转发** - 内置代理 API，支持企业代理、自定义头部、TLS 证书处理
- 🔌 **MCP 就绪** - 预留 Model Context Protocol 扩展接口，可接入 AI 自动化功能
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🛡️ **错误处理** - 全局错误边界，优雅的错误提示和降级处理

## 🏗️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 13.4.19 | React 框架（App Router） |
| TypeScript | 5.6+ | 类型安全 |
| Ant Design | 5.18+ | UI 组件库 |
| TailwindCSS | 3.4+ | 原子化 CSS |
| Axios | 1.7+ | HTTP 客户端 |
| Recharts | 2.12+ | 图表可视化 |
| Day.js | 1.11+ | 时间处理 |
| lodash-es | 4.17+ | 工具函数 |

## 📦 快速开始

### 环境要求

- Node.js >= 18.19.0
- npm >= 9.0.0

### 安装与运行

```bash
# 1. 确保使用正确的 Node 版本
nvm use 18.19

# 2. 安装依赖
npm install

# 3. 启动开发服务器（端口 4000）
npm run dev

# 4. 构建生产版本
npm run build

# 5. 启动生产服务器（端口 3000）
npm start
```

访问 http://localhost:4000 查看应用

## 📂 项目结构

```
api-hub/
├── app/                      # Next.js 13 App Router
│   ├── apis/[name]/         # 接口详情页（动态路由）
│   ├── layout.tsx           # 根布局
│   ├── page.tsx             # 首页
│   └── globals.css          # 全局样式
├── pages/api/               # Next.js API Routes
│   ├── proxy.ts             # 代理转发 API
│   └── health.ts            # 健康检查
├── components/              # React 组件
│   ├── ApiCard.tsx          # API 卡片组件
│   ├── AppShell.tsx         # 应用框架（Header/Footer/Theme）
│   ├── ErrorBoundary.tsx    # 错误边界
│   ├── LoadingFallback.tsx  # 加载状态
│   ├── StatusBadge.tsx      # 状态徽章
│   └── TestPanel.tsx        # 测试面板（核心功能）
├── services/                # 服务层
│   ├── apis.ts              # API 配置列表
│   ├── request.ts           # Axios 实例
│   ├── tester.ts            # 测试工具函数
│   ├── types.ts             # TypeScript 类型定义
│   └── mcp/                 # MCP 扩展模块（预留）
│       └── index.ts
├── package.json             # 项目配置
├── tsconfig.json            # TypeScript 配置
├── tailwind.config.ts       # TailwindCSS 配置
├── next.config.js           # Next.js 配置
└── README.md                # 项目文档
```

## 🔌 核心功能说明

### 1. 代理 API (`/api/proxy`)

**请求参数：**

```typescript
{
  url: string;                    // 目标 URL（必填）
  method?: "GET" | "HEAD" | ...;  // HTTP 方法，默认 GET
  headers?: Record<string, string>; // 自定义头部
  data?: any;                     // 请求体
  timeout?: number;               // 超时时间（ms），默认 8000
  passthroughStatus?: boolean;    // 是否透传目标状态码
  headFallbackToGet?: boolean;    // HEAD 失败时自动降级为 GET
  sendBrowserHeaders?: boolean;   // 发送浏览器标准头部
  insecureTLS?: boolean;          // 忽略 TLS 证书校验（等价 curl -k）
}
```

**响应格式：**

```typescript
{
  status: "success" | "timeout" | "error";
  httpStatus: number | null;      // HTTP 状态码
  timeCost: number;               // 响应时间（ms）
  message: string;                // 状态信息
  data?: any;                     // 响应数据
}
```

### 2. 添加新接口

编辑 `services/apis.ts`，在 `API_LIST` 数组中添加新配置：

```typescript
export const API_LIST: ApiDefinition[] = [
  {
    key: "connectivity",           // 唯一标识
    name: "前端部署服务连通性检测",  // 显示名称
    description: "通过后端代理...", // 详细描述
    method: "POST",                // HTTP 方法
    path: "/api/proxy",            // API 路径
    tags: ["monitoring"]           // 可选标签
  },
  // 添加更多接口...
];
```

### 3. MCP 扩展（预留）

项目已预留 MCP (Model Context Protocol) 集成接口，位于 `services/mcp/index.ts`。

未来可实现的功能：
- 🤖 AI 自动生成接口文档描述
- 🧪 智能生成测试用例
- 📈 接口响应分析和优化建议
- 🔔 自动化监控和告警

**使用示例：**

```typescript
import { getMCPService } from "@services/mcp";

const mcpService = getMCPService({
  enabled: true,
  apiKey: "your-api-key",
  endpoint: "https://mcp-api.example.com"
});

// 生成接口描述
const result = await mcpService.generateDescription(apiDefinition);

// 生成测试用例
const testCases = await mcpService.generateTestCases(apiDefinition);
```

## 🎨 UI 特性

### 主题切换
- 支持浅色/深色模式
- 右上角快速切换
- 基于 `next-themes` 实现，持久化存储

### 响应式设计
- 移动端优化布局
- 灵活的栅格系统
- 自适应卡片展示

### 动画效果
- 页面淡入动画
- 卡片悬浮效果
- 平滑过渡动画

## 🔧 配置说明

### 环境变量（可选）

创建 `.env.local` 文件：

```bash
# 企业代理（可选）
HTTPS_PROXY=http://proxy.company.com:8080
HTTP_PROXY=http://proxy.company.com:8080
NO_PROXY=localhost,127.0.0.1,.internal.com

# MCP 配置（预留）
MCP_API_KEY=your-mcp-api-key
MCP_ENDPOINT=https://mcp-api.example.com
```

### 构建配置

生产环境构建优化已在 `next.config.js` 中配置：
- 图片优化
- 代码分割
- Gzip 压缩

## 🚀 部署指南

### Docker 部署

```bash
# 构建镜像
docker build -t api-hub .

# 运行容器
docker run -p 3000:3000 api-hub
```

### Docker Compose

```bash
docker-compose up -d
```

### Vercel / Netlify

项目已配置好零配置部署，直接连接 Git 仓库即可自动部署。

## 📝 开发规范

### 代码风格
- 使用 ESLint + Prettier
- 遵循 Airbnb TypeScript 规范
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case 或 PascalCase

### Git 提交规范
```
feat: 新增功能
fix: 修复 Bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具链更新
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 许可证

MIT License - 仅供公司内部使用

## 📮 联系方式

- 项目负责人：[Your Name]
- 技术支持：[support@company.com]
- 文档维护：[Internal Wiki](https://wiki.company.com/api-hub)

---

<p align="center">
  Made with ❤️ by Internal Dev Team
</p>

