# 公司公共接口服务平台（前端）

基于 Next.js 13 App Router + TypeScript + Ant Design + TailwindCSS + Axios + Day.js + lodash-es + Recharts。

## 开发启动

```bash
# Node 版本
nvm use || echo "请确保 Node v18.19.0"

# 安装依赖
npm install

# 本地启动
npm run dev
```

打开 http://localhost:3000 访问。

## 目录约定
- app：App Router 页面与布局
- pages/api：Next API Route（代理转发）
- components：UI 组件（ApiCard、StatusBadge、TestPanel、AppShell）
- services：类型定义、接口配置、Axios 实例与测试封装，mcp 预留

## 代理 API
- 路由：`/pages/api/proxy`
- 请求体：`{ url, method, headers?, data?, timeout? }`
- 响应体：`{ status, httpStatus, timeCost, message, data? }`

## 备注
- UI 使用 Ant Design，Tailwind 做样式微调，支持暗色模式（右上角切换）
- 历史结果保存在 localStorage（最多 50 条）


