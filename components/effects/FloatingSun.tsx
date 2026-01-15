/**
 * FloatingSun Component
 *
 * 创建浮动渐变太阳背景元素，为场景增添氛围深度。
 * 使用大尺寸 blur 创建柔和的光晕效果。
 */
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
      aria-hidden="true"
    />
  );
}
