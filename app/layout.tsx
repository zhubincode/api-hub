import "./globals.css";
import { ReactNode } from "react";
import AppShell from "../components/AppShell";

export const metadata = {
  title: "公司公共接口服务平台",
  description: "统一展示与测试公司内部公共 API",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

