import { ImageResponse } from "next/og";

// 苹果图标元数据
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

// 生成苹果图标
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        🚀
      </div>
    ),
    {
      ...size,
    }
  );
}
