"use client";

import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

/**
 * 全局加载状态组件
 * 用于 Suspense fallback 或页面加载状态
 */
export default function LoadingFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
          size="large"
        />
        <p className="text-gray-500 dark:text-gray-400">加载中...</p>
      </div>
    </div>
  );
}
