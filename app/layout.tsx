import "./globals.css";
import { ReactNode } from "react";
import { Orbitron, Share_Tech_Mono } from "next/font/google";
import AppShell from "../components/AppShell";

// Vaporwave 字体配置
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-orbitron",
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-share-tech",
  display: "swap",
});

export const metadata = {
  title: "API Hub - 公共接口服务平台",
  description: "统一展示与测试公司内部公共 API，实时监控接口健康状态",
  keywords: ["API", "接口测试", "监控", "内部工具"],
  authors: [{ name: "Internal Dev Team" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${orbitron.variable} ${shareTechMono.variable} dark`}
    >
      <body className="font-mono">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
