"use client";

import Card from "./vaporwave/Card";
import Button from "./vaporwave/Button";
import Badge from "./vaporwave/Badge";
import StatusBadge from "./vaporwave/StatusBadge";
import type { ApiDefinition } from "@services/types";

/**
 * ApiCard Component - Vaporwave 风格
 *
 * 展示单个 API 接口的卡片，使用 Vaporwave 设计系统组件。
 */
interface Props {
  api: ApiDefinition;
  onNavigate?: () => void;
}

export default function ApiCard({ api, onNavigate }: Props) {
  return (
    <Card className="h-full">
      <div className="space-y-4">
        {/* 头部：图标 + 标题 */}
        <div className="flex items-start gap-3">
          {/* API 图标 */}
          <div className="flex-shrink-0 w-12 h-12 border-2 border-neon-cyan bg-neon-cyan/10 flex items-center justify-center transform rotate-45">
            <span className="text-2xl transform -rotate-45">🔌</span>
          </div>

          <div className="flex-1 min-w-0">
            {/* API 名称 */}
            <h3 className="font-heading font-semibold text-xl text-neon-cyan drop-shadow-glow-cyan mb-2 leading-tight">
              {api.name}
            </h3>

            {/* HTTP 方法徽章 */}
            <Badge color="magenta">{api.method}</Badge>
          </div>
        </div>

        {/* 描述 */}
        <p className="font-mono text-chrome/70 text-sm leading-relaxed line-clamp-3">
          {api.description}
        </p>

        {/* 底部：状态 + 操作按钮 */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-chrome-dark">
          <StatusBadge status="unknown" />
          <Button variant="primary" size="sm" onClick={onNavigate}>
            测试 →
          </Button>
        </div>
      </div>
    </Card>
  );
}
