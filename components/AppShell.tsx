"use client";

import "antd/dist/reset.css";
import { ReactNode } from "react";
import Link from "next/link";
import {
  ConfigProvider,
  theme as antdTheme,
  Layout,
  Typography,
  Space,
  Switch,
} from "antd";
import { ThemeProvider, useTheme } from "next-themes";

function HeaderRight() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <Space>
      <span className="text-sm">{isDark ? "深色" : "浅色"}</span>
      <Switch
        checked={isDark}
        onChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
    </Space>
  );
}

function ShellFrame({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
        token: { colorPrimary: "#1677ff", borderRadius: 6 },
      }}
    >
      <Layout className="min-h-screen">
        <Layout.Header className="!bg-white dark:!bg-neutral-900 border-b border-gray-100 dark:border-neutral-800">
          <div className="container flex items-center justify-between">
            <Typography.Title level={4} className="!mb-0">
              <Link
                href="/"
                className="text-inherit no-underline hover:opacity-80"
              >
                公共接口服务平台
              </Link>
            </Typography.Title>
            <HeaderRight />
          </div>
        </Layout.Header>
        <Layout.Content className="py-8">
          <div className="container">{children}</div>
        </Layout.Content>
        <Layout.Footer className="!bg-white dark:!bg-neutral-900 border-t border-gray-100 dark:border-neutral-800">
          <div className="container text-xs text-gray-500">
            © {new Date().getFullYear()} Internal API Hub
          </div>
        </Layout.Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ShellFrame>{children}</ShellFrame>
    </ThemeProvider>
  );
}
