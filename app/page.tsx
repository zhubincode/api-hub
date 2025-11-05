"use client";

import { Row, Col, Empty, Typography } from "antd";
import { useRouter } from "next/navigation";
import { API_LIST } from "@services/apis";
import ApiCard from "@components/ApiCard";

const { Title, Paragraph } = Typography;

export default function HomePage() {
  const router = useRouter();

  if (!API_LIST.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Empty description="暂无接口配置" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面头部说明 */}
      <div className="text-center space-y-2 py-4">
        <Title level={2} className="!mb-2">
          公共接口服务平台
        </Title>
        <Paragraph type="secondary" className="text-base">
          统一管理和测试公司内部公共 API，实时监控接口健康状态
        </Paragraph>
      </div>

      {/* API 卡片列表 */}
      <Row gutter={[24, 24]}>
        {API_LIST.map((api) => (
          <Col key={api.key} xs={24} sm={12} lg={8}>
            <ApiCard
              api={api}
              onNavigate={() => router.push(`/apis/${api.key}`)}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
