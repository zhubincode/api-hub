# Vaporwave Design System Integration

## 概述

本项目已成功集成 Vaporwave/Outrun 设计系统，将传统的企业级 UI 改造为具有强烈视觉冲击力的赛博朋克风格界面。

## 🎨 设计特点

### 核心美学
- **数字怀旧** - 融合 80 年代复古未来主义和早期计算机图形
- **霓虹光晕** - 洋红 (#FF00FF)、青色 (#00FFFF)、橙色 (#FF9900) 的高饱和度霓虹色
- **CRT 扫描线** - 全局扫描线覆盖层模拟老式 CRT 显示器
- **透视网格** - 3D 透视网格背景创造空间深度
- **终端风格** - 命令行界面元素和窗口 chrome 样式

### 视觉效果
- ✨ 全局 CRT 扫描线覆盖
- 🌅 浮动渐变太阳背景
- 🔷 透视网格地板效果
- 💫 霓虹光晕和文本发光
- ⚡ 戏剧性的 hover 动画

## 🚀 技术栈

- **Next.js 13** - App Router
- **React 18** - 组件库
- **TypeScript** - 类型安全
- **Tailwind CSS 3.4** - 样式系统
- **Google Fonts** - Orbitron + Share Tech Mono

## 📦 组件库

### 核心组件

#### Button
```tsx
import Button from "@/components/vaporwave/Button";

<Button variant="primary" size="default">
  点击我
</Button>
```

**变体：**
- `primary` - 青色边框，hover 时填充
- `secondary` - 洋红填充
- `outline` - 洋红边框
- `ghost` - 透明背景

**尺寸：** `sm` | `default` | `lg`

#### Card
```tsx
import Card from "@/components/vaporwave/Card";

<Card variant="standard" title="卡片标题">
  卡片内容
</Card>
```

**变体：**
- `standard` - 标准卡片，带霓虹边框
- `terminal` - 终端窗口风格，带窗口控制点

#### Input
```tsx
import Input from "@/components/vaporwave/Input";

<Input label="用户名" placeholder="输入用户名..." />
```

终端风格输入框，带下划线边框和光晕 focus 效果。

#### Badge
```tsx
import Badge from "@/components/vaporwave/Badge";

<Badge color="cyan">GET</Badge>
```

倾斜的徽章组件，颜色选项：`magenta` | `cyan` | `orange`

#### StatusBadge
```tsx
import StatusBadge from "@/components/vaporwave/StatusBadge";

<StatusBadge status="online" />
```

带霓虹光晕的状态徽章，状态：`online` | `offline` | `unknown`

### 布局组件

#### Container
```tsx
import Container from "@/components/vaporwave/Container";

<Container size="lg">
  内容
</Container>
```

响应式容器，尺寸：`sm` | `md` | `lg` | `xl`

#### Section
```tsx
import Section from "@/components/vaporwave/Section";

<Section withGrid>
  区块内容
</Section>
```

页面区块组件，可选透视网格背景。

#### Grid
```tsx
import Grid from "@/components/vaporwave/Grid";

<Grid cols={3} gap={8}>
  <div>项目 1</div>
  <div>项目 2</div>
  <div>项目 3</div>
</Grid>
```

响应式网格布局，移动优先设计。

### 全局效果组件

#### Scanlines
```tsx
import Scanlines from "@/components/effects/Scanlines";

<Scanlines />
```

CRT 扫描线覆盖层。

#### PerspectiveGrid
```tsx
import PerspectiveGrid from "@/components/effects/PerspectiveGrid";

<PerspectiveGrid color="magenta" opacity={0.3} />
```

透视网格背景效果。

#### FloatingSun
```tsx
import FloatingSun from "@/components/effects/FloatingSun";

<FloatingSun />
```

浮动渐变太阳背景。

## 🎨 设计令牌

### 颜色

```css
/* 背景 */
bg-void          /* #090014 - 深紫黑色 */
bg-void-light    /* #1a103c - 半透明深紫 */

/* 霓虹色 */
bg-neon-magenta  /* #FF00FF - 洋红 */
bg-neon-cyan     /* #00FFFF - 青色 */
bg-neon-orange   /* #FF9900 - 橙色 */

/* 文本 */
text-chrome      /* #E0E0E0 - 银灰色 */
text-chrome-dark /* #2D1B4E - 深紫色 */
```

### 阴影

```css
/* 霓虹光晕 */
shadow-neon-magenta     /* 洋红光晕 */
shadow-neon-magenta-lg  /* 强洋红光晕 */
shadow-neon-cyan        /* 青色光晕 */
shadow-neon-cyan-lg     /* 强青色光晕 */

/* 文本发光 */
drop-shadow-glow-white   /* 白色发光 */
drop-shadow-glow-magenta /* 洋红发光 */
drop-shadow-glow-cyan    /* 青色发光 */
```

### 字体

```css
font-heading  /* Orbitron - 用于标题 */
font-mono     /* Share Tech Mono - 用于正文/UI */
```

### 工具类

```css
gradient-text  /* 渐变文本填充 */
animate-pulse-slow  /* 慢速脉冲动画 */
```

## 📱 响应式设计

所有组件都采用移动优先设计：

- **移动端** (<640px) - 单列布局，缩小字体
- **平板** (640px-1024px) - 2 列布局
- **桌面** (>1024px) - 3-4 列布局

**关键特性：**
- ✅ 移动端保持霓虹边框和光晕效果
- ✅ 触摸目标最小 44px 高度
- ✅ 响应式字体缩放
- ✅ 透视网格在所有设备上可见

## ⚡ 性能优化

### 字体加载
- 使用 `next/font` 优化字体加载
- `display: swap` 防止字体加载闪烁 (FOIT)
- 字体变量注入到 CSS 自定义属性

### 动画性能
- 所有动画使用 `transform` 和 `opacity`（GPU 加速）
- 避免使用 `margin`、`padding`、`position` 动画
- 支持 `prefers-reduced-motion` 媒体查询

### Bundle 大小
- **移除 Ant Design** - 从 240kB 减少到 82kB
- **Tree-shaking** - 仅导入使用的组件
- **代码分割** - 按路由自动分割

## ♿ 可访问性

### WCAG 2.1 AA 合规
- ✅ 颜色对比度满足 4.5:1 标准
- ✅ 键盘导航支持（Tab、Enter、Space）
- ✅ ARIA 标签用于装饰性元素
- ✅ 触摸目标最小 44x44px
- ✅ 支持 `prefers-reduced-motion`

### 屏幕阅读器
- 装饰性效果使用 `aria-hidden="true"`
- 交互元素有适当的 ARIA 标签
- 语义化 HTML 结构

## 🛠️ 开发指南

### 添加新组件

1. 在 `components/vaporwave/` 创建组件文件
2. 使用 TypeScript 定义 props 接口
3. 添加 JSDoc 注释
4. 使用 Vaporwave 设计令牌
5. 确保响应式设计

**示例：**

```tsx
import React from "react";

/**
 * MyComponent
 * 
 * 组件描述
 * 
 * @param prop1 - 属性描述
 */
interface MyComponentProps {
  prop1: string;
  prop2?: number;
}

export default function MyComponent({ prop1, prop2 = 0 }: MyComponentProps) {
  return (
    <div className="border-2 border-neon-cyan bg-void-light p-4">
      {/* 组件内容 */}
    </div>
  );
}
```

### 使用设计令牌

始终使用 Tailwind 类而不是硬编码值：

```tsx
// ✅ 好
<div className="bg-neon-cyan text-void">

// ❌ 坏
<div style={{ background: "#00FFFF", color: "#090014" }}>
```

### 动画最佳实践

```tsx
// ✅ 好 - 使用 transform
<div className="transition-transform duration-200 hover:-translate-y-2">

// ❌ 坏 - 使用 margin
<div className="transition-all duration-200 hover:-mt-2">
```

## 🎯 设计决策

### 为什么移除 Ant Design？
- Vaporwave 美学与 Ant Design 的企业风格冲突
- 自定义组件提供完全的样式控制
- 减少 bundle 大小（-158kB）
- 更好的性能和可维护性

### 为什么仅支持暗色模式？
- Vaporwave 美学本质上是暗色的（虚空中的霓虹灯）
- 浅色模式需要完全不同的调色板
- 简化实现和维护
- 符合设计系统哲学

### 为什么使用 CSS-only 效果？
- GPU 加速的 CSS transforms 性能更好
- 避免 JavaScript 开销
- 更简单的实现
- 更好的浏览器兼容性

## 🌐 浏览器支持

**目标浏览器：**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**必需特性：**
- CSS Grid
- CSS Transforms
- CSS Backdrop Filter
- CSS Custom Properties
- ES2020 JavaScript

**降级方案：**
- Backdrop blur → 纯色背景
- Perspective transforms → 平面网格
- 自定义字体 → 系统字体栈

## 📚 参考资源

- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Next.js 字体优化](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [WCAG 2.1 指南](https://www.w3.org/WAI/WCAG21/quickref/)
- [Vaporwave 美学](https://en.wikipedia.org/wiki/Vaporwave)

## 🤝 贡献

欢迎贡献！请遵循以下准则：

1. 使用 TypeScript 和严格类型
2. 遵循现有的命名约定
3. 添加 JSDoc 注释
4. 确保响应式设计
5. 测试可访问性
6. 保持 Vaporwave 美学

## 📄 许可证

内部项目 - 保留所有权利

---

**> Powered by Vaporwave Design System** 🌌✨
