"use client";

import { notFound, useParams } from "next/navigation";
import { Card, Typography } from "antd";
import { getApiByKey } from "@services/apis";
import TestPanel from "@components/TestPanel";

export default function ApiDetailPage() {
  const params = useParams<{ name: string }>();
  const api = getApiByKey(params?.name);

  if (!api) return notFound();

  return (
    <div className="space-y-4">
      <Card>
        <Typography.Title level={4} className="!mb-2">
          {api.name}
        </Typography.Title>
        <Typography.Paragraph className="!mb-0 text-gray-500">
          {api.description}
        </Typography.Paragraph>
      </Card>
      <TestPanel api={api} />
    </div>
  );
}

