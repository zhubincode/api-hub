"use client";

import React, { Component, ReactNode } from "react";
import { Result, Button } from "antd";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * 全局错误边界组件
 * 捕获子组件树中的 JavaScript 错误，并显示备用 UI
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 可以将错误日志上报到服务器
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950 p-4">
          <Result
            status="error"
            title="页面出错了"
            subTitle={
              <div className="space-y-2">
                <p>抱歉，页面遇到了一些问题</p>
                {this.state.error && (
                  <pre className="text-xs text-left bg-gray-100 dark:bg-neutral-800 p-3 rounded max-w-2xl overflow-auto">
                    {this.state.error.message}
                  </pre>
                )}
              </div>
            }
            extra={
              <Button type="primary" onClick={this.handleReset}>
                返回首页
              </Button>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}
