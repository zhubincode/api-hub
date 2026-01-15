import React from "react";

/**
 * Grid Component
 *
 * 响应式网格布局组件，移动优先设计。
 *
 * @param children - 网格项内容
 * @param cols - 桌面端列数：1、2、3、4
 * @param gap - 网格间距（Tailwind gap 值）
 * @param className - 额外的 CSS 类
 */
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
  className = "",
}: GridProps) {
  // 使用固定的类名以确保 Tailwind 正确生成
  const gapClasses = {
    4: "gap-4",
    6: "gap-6",
    8: "gap-8",
    12: "gap-12",
  };

  const gapClass = gapClasses[gap as keyof typeof gapClasses] || "gap-8";
  const colsClass = `grid-cols-1 md:grid-cols-${cols}`;

  return (
    <div className={`grid ${colsClass} ${gapClass} ${className}`}>
      {children}
    </div>
  );
}
