"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { getApiByKey } from "@services/apis";
import TestPanel from "@components/TestPanel";
import CorsProxyPanel from "@components/CorsProxyPanel";
import Button from "@components/vaporwave/Button";
import Badge from "@components/vaporwave/Badge";
import Card from "@components/vaporwave/Card";
import Container from "@components/vaporwave/Container";

/**
 * ApiDetailPage - Vaporwave 风格详情页
 */
export default function ApiDetailPage() {
  const params = useParams();
  const router = useRouter();
  const api = getApiByKey(params?.name as string);

  if (!api) return notFound();

  return (
    <Container>
      <div className="space-y-8">
        {/* 面包屑导航 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-chrome text-sm uppercase tracking-wider">
            <span
              className="text-neon-cyan cursor-pointer hover:text-neon-magenta transition-colors"
              onClick={() => router.push("/")}
            >
              &gt; 首页
            </span>
            <span className="text-chrome-dark">/</span>
            <span className="text-chrome">{api.name}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            ← 返回
          </Button>
        </div>

        {/* 接口信息卡片 */}
        <Card variant="terminal" showWindowDots>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {/* API 图标 */}
              <div className="flex-shrink-0 w-16 h-16 border-2 border-neon-cyan bg-neon-cyan/10 flex items-center justify-center transform rotate-45">
                <span className="text-4xl transform -rotate-45">🔌</span>
              </div>

              <div className="flex-1">
                {/* API 名称 */}
                <h1 className="font-heading font-black text-3xl text-neon-cyan drop-shadow-glow-cyan mb-3 uppercase">
                  {api.name}
                </h1>

                {/* 标签 */}
                <div className="flex gap-2">
                  <Badge color="magenta">{api.method}</Badge>
                  <Badge color="cyan">{api.path}</Badge>
                </div>
              </div>
            </div>

            {/* 描述 */}
            <p className="font-mono text-chrome text-base leading-relaxed border-t-2 border-chrome-dark pt-4">
              {api.description}
            </p>
          </div>
        </Card>

        {/* 测试面板 */}
        {api.key === "connectivity" ? (
          <TestPanel api={api} />
        ) : (
          <CorsProxyPanel api={api} />
        )}
      </div>
    </Container>
  );
}
