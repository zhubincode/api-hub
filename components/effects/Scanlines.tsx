/**
 * Scanlines Component
 *
 * 创建 CRT 显示器扫描线效果的全局覆盖层。
 * 使用固定定位覆盖整个视口，pointer-events-none 确保不干扰交互。
 */
export default function Scanlines() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        background:
          "linear-gradient(rgba(18,16,20,0) 50%, rgba(0,0,0,0.25) 50%)",
        backgroundSize: "100% 4px",
      }}
      aria-hidden="true"
    />
  );
}
