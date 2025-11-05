"use client";

import { Card, Button, Tag, Typography } from "antd";
import { RightOutlined, ApiOutlined } from "@ant-design/icons";
import StatusBadge from "./StatusBadge";
import type { ApiDefinition } from "@services/types";

const { Title, Paragraph } = Typography;

interface Props {
  api: ApiDefinition;
  onNavigate?: () => void;
}

export default function ApiCard({ api, onNavigate }: Props) {
  return (
    <Card
      hoverable
      className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      styles={{
        body: { padding: "20px" },
      }}
    >
      <div className="space-y-4">
        {/* 头部：图标 + 标题 */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <ApiOutlined className="text-xl text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <Title level={5} className="!mb-1 !leading-tight">
              {api.name}
            </Title>
            <Tag color="blue" className="!text-xs !px-2 !py-0">
              {api.method}
            </Tag>
          </div>
        </div>

        {/* 描述 */}
        <Paragraph
          className="!mb-0 text-gray-600 dark:text-gray-400 !text-sm line-clamp-3"
          ellipsis={{ rows: 3 }}
        >
          {api.description}
        </Paragraph>

        {/* 底部：状态 + 操作按钮 */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-neutral-800">
          <StatusBadge status="unknown" />
          <Button
            type="primary"
            size="middle"
            icon={<RightOutlined />}
            onClick={onNavigate}
          >
            立即测试
          </Button>
        </div>
      </div>
    </Card>
  );
}
