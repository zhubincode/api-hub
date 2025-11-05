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
import ErrorBoundary from "./ErrorBoundary";

function HeaderRight() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <Space size="middle">
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {isDark ? "🌙 深色" : "☀️ 浅色"}
      </span>
      <Switch
        checked={isDark}
        onChange={(checked) => setTheme(checked ? "dark" : "light")}
        className="bg-gray-300"
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
        <Layout.Header className="!bg-white dark:!bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 shadow-sm sticky top-0 z-50">
          <div className="container flex items-center justify-between h-16">
            <Typography.Title
              level={4}
              className="!mb-0 flex items-center gap-2"
            >
              <Link
                href="/"
                className="text-inherit no-underline hover:text-blue-500 transition-colors duration-200 flex items-center gap-2"
              >
                <span className="text-2xl">🚀</span>
                <span>API Hub</span>
              </Link>
            </Typography.Title>
            <HeaderRight />
          </div>
        </Layout.Header>
        <Layout.Content className="py-8 bg-gray-50 dark:bg-neutral-950">
          <div className="container animate-fade-in">{children}</div>
        </Layout.Content>
        <Layout.Footer className="!bg-white dark:!bg-neutral-900 border-t border-gray-200 dark:border-neutral-800">
          <div className="container text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Internal API Hub · 统一接口服务平台
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Powered by Next.js + Ant Design + TailwindCSS
            </div>
          </div>
        </Layout.Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
      >
        <ShellFrame>{children}</ShellFrame>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
