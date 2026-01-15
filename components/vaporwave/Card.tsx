import React from "react";

/**
 * Card Component
 *
 * Vaporwave 风格卡片容器，支持终端窗口和标准卡片样式。
 *
 * @param variant - 卡片变体：standard（标准卡片）、terminal（终端窗口）
 * @param title - 可选标题
 * @param children - 卡片内容
 * @param showWindowDots - 是否显示窗口控制点（仅 terminal 变体）
 * @param className - 额外的 CSS 类
 */
interface CardProps {
  variant?: "standard" | "terminal";
  title?: string;
  children: React.ReactNode;
  className?: string;
  showWindowDots?: boolean;
}

export default function Card({
  variant = "standard",
  title,
  children,
  className = "",
  showWindowDots = false,
}: CardProps) {
  if (variant === "terminal") {
    return (
      <div
        className={`border-2 border-neon-cyan bg-black/80 shadow-neon-cyan ${className}`}
      >
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
