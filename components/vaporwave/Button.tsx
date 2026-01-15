import React from "react";

/**
 * Button Component
 *
 * Vaporwave 风格按钮，支持多种变体和戏剧性 hover 效果。
 *
 * @param variant - 按钮变体：primary（青色边框）、secondary（洋红填充）、outline（洋红边框）、ghost（透明）
 * @param size - 按钮尺寸：sm、default、lg
 * @param children - 按钮内容
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "default",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "rounded-none uppercase tracking-wider font-mono transition-all duration-200 ease-linear";

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
