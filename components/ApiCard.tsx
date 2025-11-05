"use client";

import { Card, Button, Space, Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import StatusBadge from "./StatusBadge";
import type { ApiDefinition } from "@services/types";

interface Props {
  api: ApiDefinition;
  onNavigate?: () => void;
}

export default function ApiCard({ api, onNavigate }: Props) {
  return (
    <Card className="h-full">
      <Space direction="vertical" size={8} className="w-full">
        <Typography.Title level={5} className="!mb-0">
          {api.name}
        </Typography.Title>
        <Typography.Paragraph className="!mb-0 text-gray-500">
          {api.description}
        </Typography.Paragraph>
        <div className="flex items-center justify-between pt-2">
          <StatusBadge status="unknown" />
          <Button type="primary" icon={<RightOutlined />} onClick={onNavigate}>
            测试
          </Button>
        </div>
      </Space>
    </Card>
  );
}

