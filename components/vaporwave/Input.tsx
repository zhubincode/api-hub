import React from "react";

/**
 * Input Component
 *
 * 终端风格输入框，带霓虹下划线边框和光晕 focus 效果。
 *
 * @param label - 可选标签文本
 * @param className - 额外的 CSS 类
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

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
