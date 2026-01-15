import React from "react";

/**
 * Badge Component
 *
 * 倾斜的徽章组件，带霓虹边框。
 *
 * @param children - 徽章内容
 * @param color - 徽章颜色：magenta、cyan、orange
 * @param className - 额外的 CSS 类
 */
interface BadgeProps {
  children: React.ReactNode;
  color?: "magenta" | "cyan" | "orange";
  className?: string;
}

export default function Badge({
  children,
  color = "cyan",
  className = "",
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
