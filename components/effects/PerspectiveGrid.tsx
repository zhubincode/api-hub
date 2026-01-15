/**
 * PerspectiveGrid Component
 *
 * 创建透视网格背景效果，模拟 Vaporwave 标志性的无限网格地板。
 * 使用 CSS transform 创建 3D 透视效果。
 *
 * @param color - 网格颜色：magenta 或 cyan
 * @param opacity - 网格不透明度 (0-1)
 */
interface PerspectiveGridProps {
  color?: "magenta" | "cyan";
  opacity?: number;
}

export default function PerspectiveGrid({
  color = "magenta",
  opacity = 0.3,
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
        transform:
          "perspective(500px) rotateX(60deg) translateY(-100px) scale(2)",
        transformOrigin: "top center",
        maskImage: "linear-gradient(to bottom, transparent, black)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black)",
        opacity,
      }}
      aria-hidden="true"
    />
  );
}
