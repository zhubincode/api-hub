"use client";

import { Component, ReactNode } from "react";

/**
 * EffectBoundary Component
 *
 * 错误边界组件，用于包装全局效果组件。
 * 如果效果渲染失败，静默降级（不显示效果），不影响应用其他部分。
 */
interface EffectBoundaryProps {
  children: ReactNode;
}

interface EffectBoundaryState {
  hasError: boolean;
}

export default class EffectBoundary extends Component<
  EffectBoundaryProps,
  EffectBoundaryState
> {
  constructor(props: EffectBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): EffectBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn("Effect rendering failed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 静默失败 - 不渲染任何内容
      return null;
    }

    return this.props.children;
  }
}
