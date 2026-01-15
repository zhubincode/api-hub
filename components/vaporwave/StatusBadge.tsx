import React from "react";

/**
 * StatusBadge Component
 *
 * 带霓虹光晕的状态徽章，显示各种状态。
 *
 * @param status - 状态：online、offline、unknown、success、error、timeout
 * @param label - 可选的自定义标签文本
 */
interface StatusBadgeProps {
  status: "online" | "offline" | "unknown" | "success" | "error" | "timeout";
  label?: string;
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const statusConfig = {
    online: {
      color: "bg-neon-cyan",
      text: label || "在线",
      glow: "shadow-neon-cyan",
    },
    success: {
      color: "bg-neon-cyan",
      text: label || "成功",
      glow: "shadow-neon-cyan",
    },
    offline: {
      color: "bg-chrome-dark",
      text: label || "离线",
      glow: "",
    },
    error: {
      color: "bg-neon-magenta",
      text: label || "错误",
      glow: "shadow-neon-magenta",
    },
    timeout: {
      color: "bg-neon-orange",
      text: label || "超时",
      glow: "shadow-[0_0_10px_#FF9900]",
    },
    unknown: {
      color: "bg-neon-magenta",
      text: label || "未知",
      glow: "shadow-neon-magenta",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-2 w-2 rounded-full ${config.color} ${config.glow} animate-pulse-slow`}
      />
      <span className="font-mono text-sm text-chrome uppercase tracking-wider">
        {config.text}
      </span>
    </div>
  );
}
