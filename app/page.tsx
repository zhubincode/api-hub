"use client";

import { useRouter } from "next/navigation";
import { API_LIST } from "@services/apis";
import ApiCard from "@components/ApiCard";
import Section from "@components/vaporwave/Section";
import Container from "@components/vaporwave/Container";
import Grid from "@components/vaporwave/Grid";

/**
 * HomePage - Vaporwave 风格主页
 *
 * 展示所有可用的 API 接口，带有 Hero 区域和透视网格背景。
 */
export default function HomePage() {
  const router = useRouter();

  if (!API_LIST.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="text-6xl">🌌</div>
          <p className="font-mono text-chrome uppercase tracking-wider">
            &gt; 暂无接口配置
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero 区域 - 带透视网格背景 */}
      <Section withGrid className="!py-16">
        <Container size="md">
          <div className="text-center space-y-6">
            {/* 渐变标题 */}
            <h1 className="font-heading font-black text-5xl sm:text-6xl md:text-7xl uppercase tracking-tight leading-tight">
              <span className="gradient-text drop-shadow-glow-magenta">
                公共接口
              </span>
              <br />
              <span className="text-neon-cyan drop-shadow-glow-cyan">
                服务平台
              </span>
            </h1>

            {/* 副标题 */}
            <p className="font-mono text-chrome text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              &gt; 统一管理和测试公司内部公共 API
              <br />
              &gt; 实时监控接口健康状态
            </p>
          </div>
        </Container>
      </Section>

      {/* API 卡片列表 */}
      <Container>
        <Grid cols={3} gap={8}>
          {API_LIST.map((api) => (
            <ApiCard
              key={api.key}
              api={api}
              onNavigate={() => router.push(`/apis/${api.key}`)}
            />
          ))}
        </Grid>
      </Container>
    </div>
  );
}
