"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { Card, Typography, Breadcrumb, Button, Space, Tag } from "antd";
import {
  HomeOutlined,
  ArrowLeftOutlined,
  ApiOutlined,
} from "@ant-design/icons";
import { getApiByKey } from "@services/apis";
import TestPanel from "@components/TestPanel";

const { Title, Paragraph } = Typography;

export default function ApiDetailPage() {
  const params = useParams();
  const router = useRouter();
  const api = getApiByKey(params?.name as string);

  if (!api) return notFound();

  return (
    <div className="space-y-6">
      {/* 面包屑导航 */}
      <div className="flex items-center justify-between">
        <Breadcrumb
          items={[
            {
              href: "/",
              title: (
                <Space>
                  <HomeOutlined />
                  <span>首页</span>
                </Space>
              ),
            },
            {
              title: (
                <Space>
                  <ApiOutlined />
                  <span>{api.name}</span>
                </Space>
              ),
            },
          ]}
        />
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          返回
        </Button>
      </div>

      {/* 接口信息卡片 */}
      <Card className="shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <ApiOutlined className="text-2xl text-white" />
            </div>
            <div className="flex-1">
              <Title level={3} className="!mb-1">
                {api.name}
              </Title>
              <Space>
                <Tag color="blue" className="!text-sm">
                  {api.method}
                </Tag>
                <Tag color="default" className="!text-sm">
                  {api.path}
                </Tag>
              </Space>
            </div>
          </div>
          <Paragraph className="!mb-0 text-gray-600 dark:text-gray-400 text-base">
            {api.description}
          </Paragraph>
        </div>
      </Card>

      {/* 测试面板 */}
      <TestPanel api={api} />
    </div>
  );
}
