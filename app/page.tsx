"use client";

import { useMemo } from "react";
import { Row, Col, Empty } from "antd";
import { useRouter } from "next/navigation";
import { API_LIST } from "@services/apis";
import ApiCard from "@components/ApiCard";

export default function HomePage() {
  const router = useRouter();

  const apis = useMemo(() => API_LIST, []);

  if (!apis.length) return <Empty description="暂无接口" />;

  return (
    <Row gutter={[16, 16]}>
      {apis.map((api) => (
        <Col key={api.key} xs={24} sm={12} lg={8}>
          <ApiCard
            api={api}
            onNavigate={() => router.push(`/apis/${api.key}`)}
          />
        </Col>
      ))}
    </Row>
  );
}

