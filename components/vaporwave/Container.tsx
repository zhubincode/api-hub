import React from "react";

/**
 * Container Component
 *
 * 响应式容器组件，提供最大宽度约束和水平居中。
 *
 * @param children - 容器内容
 * @param size - 容器尺寸：sm (max-w-4xl)、md (max-w-5xl)、lg (max-w-6xl)、xl (max-w-7xl)
 * @param className - 额外的 CSS 类
 */
interface ContainerProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function Container({
  children,
  size = "lg",
  className = "",
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
