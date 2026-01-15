"use client";

import { ReactNode } from "react";
import Link from "next/link";
import ErrorBoundary from "./ErrorBoundary";
import Scanlines from "./effects/Scanlines";
import FloatingSun from "./effects/FloatingSun";
import EffectBoundary from "./effects/EffectBoundary";

/**
 * Vaporwave AppShell
 *
 * 应用外壳组件，提供统一的 Vaporwave 风格布局。
 * 包含 Header、Footer 和全局视觉效果（扫描线、浮动太阳）。
 */
function ShellFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-void text-chrome">
      {/* 全局效果层 */}
      <EffectBoundary>
        <Scanlines />
        <FloatingSun />
      </EffectBoundary>

      {/* Header - 终端窗口风格 */}
      <header className="sticky top-0 z-40 border-b-2 border-neon-cyan bg-void-light/90 backdrop-blur-md shadow-neon-cyan">
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 no-underline group">
            <span className="text-3xl transition-transform duration-200 group-hover:scale-110">
              🚀
            </span>
            <h1 className="text-2xl font-heading font-black uppercase tracking-wider text-neon-cyan drop-shadow-glow-cyan m-0">
              API Hub
            </h1>
          </Link>

          {/* Window Control Dots */}
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-neon-magenta shadow-neon-magenta" />
            <div className="h-3 w-3 rounded-full bg-neon-cyan shadow-neon-cyan" />
            <div className="h-3 w-3 rounded-full bg-neon-orange" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 relative z-10">
        <div className="container animate-fade-in">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-neon-magenta bg-void-light/90 backdrop-blur-md py-6">
        <div className="container text-center space-y-2">
          <div className="font-mono text-sm text-chrome/80 uppercase tracking-wider">
            © {new Date().getFullYear()} Internal API Hub · 统一接口服务平台
          </div>
          <div className="font-mono text-xs text-chrome/50 uppercase tracking-widest">
            &gt; Powered by Next.js + Vaporwave Design System
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <ShellFrame>{children}</ShellFrame>
    </ErrorBoundary>
  );
}
