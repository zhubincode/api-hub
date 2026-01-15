import React from "react";
import PerspectiveGrid from "../effects/PerspectiveGrid";

/**
 * Section Component
 *
 * 页面区块组件，提供标准垂直间距和可选的透视网格背景。
 *
 * @param children - 区块内容
 * @param withGrid - 是否显示透视网格背景
 * @param className - 额外的 CSS 类
 */
interface SectionProps {
  children: React.ReactNode;
  withGrid?: boolean;
  className?: string;
}

export default function Section({
  children,
  withGrid = false,
  className = "",
}: SectionProps) {
  return (
    <section className={`relative py-20 sm:py-32 ${className}`}>
      {withGrid && <PerspectiveGrid />}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
