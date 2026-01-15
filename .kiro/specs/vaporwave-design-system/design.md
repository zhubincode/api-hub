# Design Document: Vaporwave Design System Integration

## Overview

本设计文档描述了如何将 Vaporwave/Outrun 设计系统集成到现有的 API Hub Next.js 应用中。设计采用渐进式迁移策略，优先建立设计令牌基础，然后创建核心组件库，最后逐步迁移现有页面。

### Design Philosophy

Vaporwave 设计系统的核心是**最大化视觉冲击力**和**数字怀旧感**。我们将通过以下方式实现：

1. **分层架构** - 设计令牌 → 全局效果 → 组件库 → 页面组合
2. **渐进增强** - 从基础样式开始，逐步添加复杂效果
3. **性能优先** - 使用 CSS transforms、GPU 加速、字体优化
4. **可维护性** - TypeScript 类型、清晰的组件 API、文档完善

## Architecture

### System Layers

```
┌─────────────────────────────────────────┐
│         Pages & Features                │  ← 业务页面
├─────────────────────────────────────────┤
│      Component Library                  │  ← Button, Card, Input 等
├─────────────────────────────────────────┤
│      Global Effects Layer               │  ← Scanlines, Grid, Sun
├─────────────────────────────────────────┤
│      Design Tokens (Tailwind)           │  ← Colors, Fonts, Spacing
├─────────────────────────────────────────┤
│      Next.js + React + TypeScript       │  ← 基础框架
└─────────────────────────────────────────┘
```

### Directory Structure

```
├── app/
│   ├── globals.css                    # 全局样式 + Vaporwave 效果
│   ├── layout.tsx                     # 根布局（字体加载）
│   └── page.tsx                       # 主页（迁移到 Vaporwave）
├── components/
│   ├── vaporwave/                     # Vaporwave 组件库
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Container.tsx
│   │   ├── Section.tsx
│   │   ├── Grid.tsx
│   │   └── StatusBadge.tsx
│   ├── effects/                       # 全局效果组件
│   │   ├── Scanlines.tsx
│   │   ├── PerspectiveGrid.tsx
│   │   └── FloatingSun.tsx
│   └── AppShell.tsx                   # 应用外壳（迁移）
├── styles/
│   └── vaporwave.css                  # Vaporwave 特定样式
└── tailwind.config.ts                 # 扩展设计令牌
```

## Components and Interfaces

### 1. Design Tokens (Tailwind Configuration)

**Purpose**: 集中管理所有设计变量，确保一致性。

**Implementation**:

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vaporwave 颜色系统
        void: {
          DEFAULT: "#090014",
          light: "#1a103c",
        },
        neon: {
          magenta: "#FF00FF",
          cyan: "#00FFFF",
          orange: "#FF9900",
        },
        chrome: {
          DEFAULT: "#E0E0E0",
          dark: "#2D1B4E",
        },
      },
      fontFamily: {
        heading: ["var(--font-orbitron)", "sans-serif"],
        mono: ["var(--font-share-tech)", "monospace"],
      },
      boxShadow: {
        "neon-magenta": "0 0 10px #FF00FF",
        "neon-magenta-lg": "0 0 20px #FF00FF",
        "neon-cyan": "0 0 20px rgba(0,255,255,0.2)",
        "neon-cyan-lg": "0 0 50px rgba(0,255,255,0.2)",
      },
      dropShadow: {
        "glow-white": "0 0 10px rgba(255,255,255,0.5)",
        "glow-magenta": "0 0 30px rgba(255,0,255,0.6)",
        "glow-cyan": "0 0 5px rgba(0,255,255,0.8)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
```

### 2. Font Loading (Next.js Font Optimization)

**Purpose**: 加载 Orbitron 和 Share Tech Mono 字体，避免布局偏移。

**Implementation**:

```typescript
// app/layout.tsx
import { Orbitron, Share_Tech_Mono } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-orbitron",
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-share-tech",
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" className={`${orbitron.variable} ${shareTechMono.variable}`}>
      <body className="font-mono">{children}</body>
    </html>
  );
}
```

### 3. Global Effects Layer

#### 3.1 Scanlines Component

**Purpose**: 创建 CRT 显示器扫描线效果。

**Interface**:

```typescript
// components/effects/Scanlines.tsx
export default function Scanlines(): JSX.Element;
```

**Implementation**:

```typescript
export default function Scanlines() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        background: "linear-gradient(rgba(18,16,20,0) 50%, rgba(0,0,0,0.25) 50%)",
        backgroundSize: "100% 4px",
      }}
    />
  );
}
```

#### 3.2 PerspectiveGrid Component

**Purpose**: 创建透视网格背景效果。

**Interface**:

```typescript
interface PerspectiveGridProps {
  color?: "magenta" | "cyan";
  opacity?: number;
}

export default function PerspectiveGrid(props: PerspectiveGridProps): JSX.Element;
```

**Implementation**:

```typescript
export default function PerspectiveGrid({ 
  color = "magenta", 
  opacity = 0.3 
}: PerspectiveGridProps) {
  const gridColor = color === "magenta" ? "#FF00FF" : "#00FFFF";
  
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(transparent 95%, ${gridColor} 95%),
          linear-gradient(90deg, transparent 95%, ${gridColor} 95%)
        `,
        backgroundSize: "40px 40px",
        transform: "perspective(500px) rotateX(60deg) translateY(-100px) scale(2)",
        transformOrigin: "top center",
        maskImage: "linear-gradient(to bottom, transparent, black)",
        opacity,
      }}
    />
  );
}
```

#### 3.3 FloatingSun Component

**Purpose**: 创建背景浮动太阳渐变效果。

**Interface**:

```typescript
export default function FloatingSun(): JSX.Element;
```

**Implementation**:

```typescript
export default function FloatingSun() {
  return (
    <div
      className="fixed top-1/4 left-1/2 -translate-x-1/2 pointer-events-none"
      style={{
        width: "600px",
        height: "600px",
        background: "linear-gradient(to bottom, #FF9900, #FF00FF)",
        filter: "blur(100px)",
        opacity: 0.2,
        zIndex: 0,
      }}
    />
  );
}
```

### 4. Component Library

#### 4.1 Button Component

**Purpose**: Vaporwave 风格按钮，支持多种变体和戏剧性 hover 效果。

**Interface**:

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  children: React.ReactNode;
}

export default function Button(props: ButtonProps): JSX.Element;
```

**Implementation**:

```typescript
export default function Button({
  variant = "primary",
  size = "default",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "rounded-none uppercase tracking-wider font-mono transition-all duration-200 ease-linear";
  
  const sizeStyles = {
    sm: "h-9 px-4 text-sm",
    default: "h-12 px-6 text-base",
    lg: "h-14 px-8 text-lg",
  };
  
  const variantStyles = {
    primary: `
      -skew-x-12 transform
      border-2 border-neon-cyan bg-transparent text-neon-cyan
      hover:skew-x-0 hover:bg-neon-cyan hover:text-black hover:shadow-neon-cyan-lg
    `,
    secondary: `
      -skew-x-12 transform
      border-2 border-neon-magenta bg-neon-magenta text-white
      hover:skew-x-0 hover:scale-105 hover:opacity-80
    `,
    outline: `
      border-2 border-neon-magenta bg-transparent text-neon-magenta
      hover:bg-neon-magenta hover:text-white
    `,
    ghost: `
      text-chrome hover:bg-neon-cyan/10 hover:text-neon-cyan
    `,
  };
  
  const needsSkewCorrection = variant === "primary" || variant === "secondary";
  
  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {needsSkewCorrection ? (
        <span className="inline-block skew-x-12 transform">{children}</span>
      ) : (
        children
      )}
    </button>
  );
}
```

#### 4.2 Card Component

**Purpose**: Vaporwave 风格卡片容器，支持终端窗口和标准卡片样式。

**Interface**:

```typescript
interface CardProps {
  variant?: "standard" | "terminal";
  title?: string;
  children: React.ReactNode;
  className?: string;
  showWindowDots?: boolean;
}

export default function Card(props: CardProps): JSX.Element;
```

**Implementation**:

```typescript
export default function Card({
  variant = "standard",
  title,
  children,
  className = "",
  showWindowDots = false,
}: CardProps) {
  if (variant === "terminal") {
    return (
      <div className={`border-2 border-neon-cyan bg-black/80 shadow-neon-cyan ${className}`}>
        {title && (
          <div className="bg-neon-cyan/10 border-b border-neon-cyan px-4 py-2 flex items-center justify-between">
            <span className="font-mono text-sm text-neon-cyan">{title}</span>
            {showWindowDots && (
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-neon-magenta" />
                <div className="h-3 w-3 rounded-full bg-neon-cyan" />
                <div className="h-3 w-3 rounded-full bg-neon-orange" />
              </div>
            )}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    );
  }
  
  return (
    <div
      className={`
        border border-neon-magenta/30 border-t-2 border-t-neon-cyan
        bg-void-light/80 backdrop-blur-md p-6
        transition-all duration-200 hover:-translate-y-2 hover:shadow-neon-cyan
        ${className}
      `}
    >
      {title && (
        <h3 className="font-heading font-semibold text-2xl text-neon-cyan drop-shadow-glow-cyan mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
```

#### 4.3 Input Component

**Purpose**: 终端风格输入框。

**Interface**:

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input(props: InputProps): JSX.Element;
```

**Implementation**:

```typescript
export default function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block font-mono text-sm text-chrome uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={`
          w-full border-b-2 border-neon-magenta bg-black
          text-neon-cyan font-mono text-lg px-3 py-2
          placeholder:text-neon-magenta/50
          focus-visible:border-neon-cyan focus-visible:shadow-[0_0_15px_#00FFFF]
          focus-visible:outline-none
          transition-all duration-200
          ${className}
        `}
        {...props}
      />
    </div>
  );
}
```

#### 4.4 Badge Component

**Purpose**: 倾斜的徽章组件。

**Interface**:

```typescript
interface BadgeProps {
  children: React.ReactNode;
  color?: "magenta" | "cyan" | "orange";
  className?: string;
}

export default function Badge(props: BadgeProps): JSX.Element;
```

**Implementation**:

```typescript
export default function Badge({ 
  children, 
  color = "cyan", 
  className = "" 
}: BadgeProps) {
  const colorStyles = {
    magenta: "border-neon-magenta text-neon-magenta",
    cyan: "border-neon-cyan text-neon-cyan",
    orange: "border-neon-orange text-neon-orange",
  };
  
  return (
    <span
      className={`
        inline-block -skew-x-12 transform
        border-2 ${colorStyles[color]}
        bg-transparent px-3 py-1
        font-mono text-xs uppercase tracking-wider
        ${className}
      `}
    >
      <span className="inline-block skew-x-12 transform">{children}</span>
    </span>
  );
}
```

#### 4.5 StatusBadge Component

**Purpose**: 带霓虹光晕的状态徽章。

**Interface**:

```typescript
interface StatusBadgeProps {
  status: "online" | "offline" | "unknown";
  label?: string;
}

export default function StatusBadge(props: StatusBadgeProps): JSX.Element;
```

**Implementation**:

```typescript
export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const statusConfig = {
    online: {
      color: "neon-cyan",
      text: label || "在线",
      glow: "shadow-neon-cyan",
    },
    offline: {
      color: "chrome-dark",
      text: label || "离线",
      glow: "",
    },
    unknown: {
      color: "neon-magenta",
      text: label || "未知",
      glow: "shadow-neon-magenta",
    },
  };
  
  const config = statusConfig[status];
  
  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full bg-${config.color} ${config.glow} animate-pulse-slow`} />
      <span className="font-mono text-sm text-chrome uppercase tracking-wider">
        {config.text}
      </span>
    </div>
  );
}
```

#### 4.6 Layout Components

**Container**:

```typescript
interface ContainerProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function Container({ 
  children, 
  size = "lg", 
  className = "" 
}: ContainerProps) {
  const sizeStyles = {
    sm: "max-w-4xl",
    md: "max-w-5xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
  };
  
  return (
    <div className={`mx-auto px-4 ${sizeStyles[size]} ${className}`}>
      {children}
    </div>
  );
}
```

**Section**:

```typescript
interface SectionProps {
  children: React.ReactNode;
  withGrid?: boolean;
  className?: string;
}

export default function Section({ 
  children, 
  withGrid = false, 
  className = "" 
}: SectionProps) {
  return (
    <section className={`relative py-20 sm:py-32 ${className}`}>
      {withGrid && <PerspectiveGrid />}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
```

**Grid**:

```typescript
interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: number;
  className?: string;
}

export default function Grid({ 
  children, 
  cols = 3, 
  gap = 8, 
  className = "" 
}: GridProps) {
  const colsClass = `grid-cols-1 md:grid-cols-${cols}`;
  const gapClass = `gap-${gap}`;
  
  return (
    <div className={`grid ${colsClass} ${gapClass} ${className}`}>
      {children}
    </div>
  );
}
```

## Data Models

本项目主要处理 UI 组件，不涉及复杂的数据模型。主要的类型定义：

```typescript
// types/vaporwave.ts

export type NeonColor = "magenta" | "cyan" | "orange";
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "default" | "lg";
export type CardVariant = "standard" | "terminal";
export type StatusType = "online" | "offline" | "unknown";
export type ContainerSize = "sm" | "md" | "lg" | "xl";

export interface VaporwaveTheme {
  colors: {
    void: string;
    voidLight: string;
    neonMagenta: string;
    neonCyan: string;
    neonOrange: string;
    chrome: string;
    chromeDark: string;
  };
  fonts: {
    heading: string;
    mono: string;
  };
}
```

## Correctness Properties

*属性是一种特征或行为，应该在系统的所有有效执行中保持为真——本质上是关于系统应该做什么的正式陈述。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*


### Property Reflection

在分析了所有需求后，我识别出以下可以合并或优化的属性：

- **字体应用属性** (5.3, 5.4) 可以合并为一个综合属性，测试所有元素类型的字体应用
- **组件渲染示例** (3.1-3.6, 4.1-4.3) 大多是具体示例，不需要合并
- **响应式属性** (10.1-10.4) 可以合并为一个综合的响应式行为属性
- **TypeScript 和文档属性** (12.1, 12.2) 可以保持独立，因为它们测试不同方面

### Correctness Properties

基于需求分析，以下是可测试的正确性属性：

#### Property 1: Semantic Color Classes Availability

*For any* Vaporwave semantic color name (neon-magenta, neon-cyan, neon-orange, void, chrome), the Tailwind configuration should generate corresponding utility classes (bg-, text-, border-) that can be used in components.

**Validates: Requirements 1.2**

#### Property 2: Existing Utility Classes Preservation

*For any* commonly used Tailwind utility class from the default theme (e.g., bg-gray-100, text-sm, p-4), the extended configuration should not break or override these classes, ensuring backward compatibility.

**Validates: Requirements 1.5**

#### Property 3: Global Effects Non-Interference

*For any* global effect component (Scanlines, PerspectiveGrid, FloatingSun), the rendered element should have `pointer-events-none` class to ensure it doesn't interfere with user interactions.

**Validates: Requirements 2.4**

#### Property 4: Component TypeScript Type Safety

*For all* components in the Vaporwave component library, TypeScript compilation should succeed without errors, and all props should have explicit type definitions.

**Validates: Requirements 3.7, 12.1**

#### Property 5: Responsive Layout Behavior

*For all* layout components (Container, Section, Grid), the rendered output should include mobile-first responsive classes (e.g., grid-cols-1 md:grid-cols-3) that adapt to different viewport sizes.

**Validates: Requirements 4.4, 10.3**

#### Property 6: Font Application Consistency

*For any* rendered page, heading elements (h1-h6) should use the Orbitron font family, and body/UI elements (p, button, input) should use Share Tech Mono font family.

**Validates: Requirements 5.3, 5.4**

#### Property 7: Accessibility Standards Compliance

*For all* interactive components (Button, Input, Card with onClick), the rendered elements should include appropriate ARIA attributes, keyboard navigation support, and meet WCAG 2.1 AA standards.

**Validates: Requirements 6.3**

#### Property 8: Mobile Responsive Design

*For any* component rendered on mobile viewport (<640px), the component should maintain neon borders, glows, and essential Vaporwave styling while scaling typography and stacking layouts appropriately.

**Validates: Requirements 10.1, 10.2, 10.4**

#### Property 9: Touch Target Accessibility

*For all* interactive elements (buttons, links, inputs), the minimum height should be at least 44px (h-11 or larger in Tailwind) to meet touch target accessibility guidelines.

**Validates: Requirements 10.5**

#### Property 10: Animation Performance Optimization

*For all* animated elements, the animations should use CSS transform and opacity properties (GPU-accelerated) rather than layout-affecting properties like margin, padding, or position.

**Validates: Requirements 11.2**

#### Property 11: Will-Change Usage Restraint

*For any* element using the will-change CSS property, it should only be applied to elements that are actively animating or about to animate, not as a blanket optimization.

**Validates: Requirements 11.3**

#### Property 12: Component Documentation Completeness

*For all* exported components in the component library, the component file should include JSDoc comments describing the component's purpose, props, and usage examples.

**Validates: Requirements 12.2**

#### Property 13: Naming Convention Consistency

*For all* component files, the file names should follow PascalCase convention, and component function names should match their file names.

**Validates: Requirements 12.4**

## Error Handling

### Font Loading Failures

**Scenario**: Google Fonts fails to load due to network issues or blocking.

**Handling**:
- Use `display: swap` in font configuration to show fallback fonts immediately
- Define fallback font stacks: `sans-serif` for Orbitron, `monospace` for Share Tech Mono
- No error boundaries needed - graceful degradation is automatic

### Component Prop Validation

**Scenario**: Invalid props passed to components (e.g., unsupported variant).

**Handling**:
- Use TypeScript to catch errors at compile time
- Provide default values for all optional props
- Use discriminated unions for variant types to ensure type safety

```typescript
// Example: Button variant validation
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps {
  variant?: ButtonVariant; // TypeScript ensures only valid values
}

export default function Button({ variant = "primary", ...props }: ButtonProps) {
  // Default value ensures component always works
}
```

### Missing Global Effects

**Scenario**: Global effect components fail to render.

**Handling**:
- Effects are purely decorative - app remains functional without them
- Use React Error Boundaries around effect components
- Log errors to console for debugging but don't crash the app

```typescript
// components/effects/EffectBoundary.tsx
export default function EffectBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={null} // Render nothing if effect fails
      onError={(error) => console.warn("Effect rendering failed:", error)}
    >
      {children}
    </ErrorBoundary>
  );
}
```

### Responsive Breakpoint Edge Cases

**Scenario**: Components render incorrectly at unusual viewport sizes.

**Handling**:
- Test at standard breakpoints: 320px, 640px, 768px, 1024px, 1280px
- Use Tailwind's mobile-first approach to ensure base styles work
- Add container queries for complex components if needed

### Performance Degradation

**Scenario**: Too many visual effects cause performance issues.

**Handling**:
- Use `will-change` sparingly and remove after animation completes
- Implement reduced motion media query for accessibility
- Provide option to disable decorative effects

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Testing Strategy

### Dual Testing Approach

We will use both **unit tests** and **property-based tests** to ensure comprehensive coverage:

- **Unit tests**: Verify specific component rendering, prop handling, and edge cases
- **Property tests**: Verify universal properties across all components and configurations

### Unit Testing

**Framework**: Jest + React Testing Library

**Focus Areas**:
1. **Component Rendering**: Each component renders without errors
2. **Prop Handling**: Components accept and apply props correctly
3. **Variant Rendering**: Different variants produce expected output
4. **Accessibility**: ARIA attributes and keyboard navigation work
5. **Edge Cases**: Empty children, missing props, extreme values

**Example Unit Tests**:

```typescript
// components/vaporwave/__tests__/Button.test.tsx
import { render, screen } from "@testing-library/react";
import Button from "../Button";

describe("Button Component", () => {
  it("renders primary variant with correct classes", () => {
    render(<Button variant="primary">Click Me</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("border-neon-cyan");
  });

  it("applies skew correction to primary and secondary variants", () => {
    const { container } = render(<Button variant="primary">Test</Button>);
    const span = container.querySelector("span");
    expect(span).toHaveClass("skew-x-12");
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByRole("button").click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Property-Based Testing

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**: Minimum 100 iterations per property test

**Focus Areas**:
1. **Type Safety**: All prop combinations type-check correctly
2. **Responsive Behavior**: Components work at all viewport sizes
3. **Font Application**: Correct fonts applied to all element types
4. **Accessibility**: All interactive elements meet standards
5. **Performance**: Animations use GPU-accelerated properties

**Example Property Tests**:

```typescript
// components/vaporwave/__tests__/Button.property.test.tsx
import { render } from "@testing-library/react";
import * as fc from "fast-check";
import Button from "../Button";

/**
 * Feature: vaporwave-design-system, Property 4: Component TypeScript Type Safety
 */
describe("Button Property Tests", () => {
  it("accepts any valid variant and size combination", () => {
    fc.assert(
      fc.property(
        fc.constantFrom("primary", "secondary", "outline", "ghost"),
        fc.constantFrom("sm", "default", "lg"),
        fc.string(),
        (variant, size, text) => {
          const { container } = render(
            <Button variant={variant} size={size}>
              {text}
            </Button>
          );
          expect(container.firstChild).toBeInTheDocument();
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: vaporwave-design-system, Property 9: Touch Target Accessibility
 */
describe("Touch Target Property Tests", () => {
  it("all button sizes meet minimum 44px height", () => {
    fc.assert(
      fc.property(
        fc.constantFrom("sm", "default", "lg"),
        (size) => {
          const { container } = render(<Button size={size}>Test</Button>);
          const button = container.firstChild as HTMLElement;
          const height = parseInt(getComputedStyle(button).height);
          expect(height).toBeGreaterThanOrEqual(44);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Integration Testing

**Framework**: Playwright or Cypress

**Focus Areas**:
1. **Page Migration**: Migrated pages maintain functionality
2. **Visual Regression**: Screenshots match expected Vaporwave styling
3. **Performance**: Lighthouse scores meet targets
4. **Cross-Browser**: Works in Chrome, Firefox, Safari

### Testing Checklist

- [ ] All components have unit tests with >80% coverage
- [ ] Property tests validate universal correctness properties
- [ ] Integration tests verify page-level functionality
- [ ] Visual regression tests catch styling regressions
- [ ] Accessibility tests pass WCAG 2.1 AA standards
- [ ] Performance tests meet Lighthouse score targets

## Implementation Notes

### Migration Strategy

**Phase 1: Foundation** (Week 1)
1. Update Tailwind configuration with Vaporwave tokens
2. Add font loading to layout.tsx
3. Create global effects components
4. Update globals.css with Vaporwave base styles

**Phase 2: Component Library** (Week 2)
1. Create core components (Button, Card, Input, Badge)
2. Create layout components (Container, Section, Grid)
3. Write unit tests for all components
4. Create component showcase page

**Phase 3: Page Migration** (Week 3)
1. Migrate AppShell (header, footer)
2. Migrate homepage
3. Migrate API detail pages
4. Write integration tests

**Phase 4: Polish & Optimization** (Week 4)
1. Performance optimization
2. Accessibility audit
3. Visual regression testing
4. Documentation completion

### Key Design Decisions

**Decision 1: Keep or Remove Ant Design?**

**Recommendation**: Gradually remove Ant Design

**Rationale**:
- Ant Design's design language conflicts with Vaporwave aesthetics
- Theming Ant Design to match Vaporwave is more work than building custom components
- Custom components give us full control over styling and behavior
- Bundle size reduction by removing unused library

**Approach**:
- Phase 1-2: Build Vaporwave components alongside Ant Design
- Phase 3: Replace Ant Design usage page by page
- Phase 4: Remove Ant Design dependency

**Decision 2: Dark Mode Only or Support Light Mode?**

**Recommendation**: Dark mode only

**Rationale**:
- Vaporwave aesthetic is fundamentally dark (neon lights in void)
- Light mode would require completely different color palette
- Simplifies implementation and maintenance
- Aligns with design system philosophy

**Approach**:
- Remove theme toggle from AppShell
- Set `<html class="dark">` permanently
- Update Tailwind config to use dark mode colors as defaults

**Decision 3: Global Effects Performance**

**Recommendation**: Use CSS-only effects with optional disable

**Rationale**:
- CSS transforms are GPU-accelerated
- Fixed positioning avoids layout recalculation
- Pointer-events-none prevents interaction overhead
- Provide escape hatch for low-end devices

**Approach**:
- Implement all effects with pure CSS
- Use `will-change` only during active animations
- Add `prefers-reduced-motion` support
- Consider adding user preference toggle

**Decision 4: Component API Design**

**Recommendation**: Simple, composable props with sensible defaults

**Rationale**:
- Easy to learn and use
- TypeScript provides type safety
- Defaults ensure components work out of the box
- Composition over configuration

**Example**:
```typescript
// Good: Simple, clear API
<Button variant="primary" size="lg">Click Me</Button>

// Avoid: Over-configuration
<Button 
  skew={-12} 
  hoverSkew={0} 
  borderColor="#00FFFF" 
  glowIntensity={20}
>
  Click Me
</Button>
```

### Performance Considerations

1. **Font Loading**: Use `next/font` with `display: swap` to prevent FOIT
2. **CSS Transforms**: All animations use `transform` and `opacity` only
3. **Fixed Positioning**: Global effects use `position: fixed` to avoid reflows
4. **Lazy Loading**: Consider lazy loading heavy effects on mobile
5. **Bundle Size**: Tree-shake unused components, remove Ant Design

### Accessibility Considerations

1. **Color Contrast**: Ensure neon colors meet WCAG AA standards (4.5:1 for text)
2. **Keyboard Navigation**: All interactive elements support Tab, Enter, Space
3. **Screen Readers**: Provide ARIA labels for decorative elements
4. **Reduced Motion**: Respect `prefers-reduced-motion` media query
5. **Touch Targets**: Minimum 44x44px for all interactive elements

### Browser Support

**Target Browsers**:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Required Features**:
- CSS Grid
- CSS Transforms
- CSS Backdrop Filter
- CSS Custom Properties
- ES2020 JavaScript

**Fallbacks**:
- Backdrop blur: Solid background color
- Perspective transforms: Flat grid pattern
- Custom fonts: System font stack

## Conclusion

This design provides a comprehensive, maintainable approach to integrating the Vaporwave design system into the API Hub application. The architecture prioritizes:

1. **Centralized Design Tokens**: Single source of truth in Tailwind config
2. **Composable Components**: Reusable, type-safe building blocks
3. **Performance**: GPU-accelerated animations, optimized fonts
4. **Accessibility**: WCAG compliance, keyboard navigation, reduced motion
5. **Maintainability**: Clear structure, comprehensive tests, good documentation

The phased migration strategy allows for incremental progress while maintaining a working application at each step.
