"use client";

import { useCallback, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Select,
  Typography,
  Collapse,
  Empty,
} from "antd";
import type { ApiDefinition } from "@services/types";
import request from "@services/request";

type CorsProxyForm = {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
};

const { Paragraph, Text } = Typography;

const CorsProxyPanel = ({ api }: { api: ApiDefinition }) => {
  const [form] = Form.useForm<CorsProxyForm>();
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState<any | null>(null);

  const origin =
    typeof window === "undefined" ? "" : window.location.origin || "";
  const urlValue = Form.useWatch("url", form) || "";
  const encodedPath = urlValue
    ? `/api/cors-path/${encodeURIComponent(urlValue)}`
    : "";
  const encodedBaseExample =
    origin && encodedPath ? `${origin}${encodedPath}` : "";

  const onSubmit = useCallback(
    async (values: CorsProxyForm) => {
      setLoading(true);
      try {
        let parsedBody: unknown = undefined;
        if (values.body) {
          try {
            parsedBody = JSON.parse(values.body);
          } catch {
            // eslint-disable-next-line no-alert
            alert("Body 需要是合法 JSON 字符串");
            setLoading(false);
            return;
          }
        }

        const resp = await request.post("/api/cors-proxy", {
          target: values.url,
          method: values.method,
          body: parsedBody,
        });
        setLast(resp.data);
      } catch (error) {
        setLast({ error: String((error as any)?.message || error) });
      } finally {
        setLoading(false);
      }
    },
    [form]
  );

  return (
    <div className="space-y-6">
      <Card className="shadow-sm" title={api.name}>
        <Paragraph className="!mb-4 text-gray-600 dark:text-gray-400 text-base">
          {api.description}
        </Paragraph>
        <Form<CorsProxyForm>
          form={form}
          layout="vertical"
          initialValues={{ method: "GET" }}
          onFinish={onSubmit}
        >
          <Form.Item
            label="目标 URL"
            name="url"
            rules={[{ required: true, message: "请输入目标 URL" }]}
          >
            <Input
              size="large"
              placeholder="https://192.168.199.251/tgcloud/admin/api/..."
              allowClear
            />
          </Form.Item>

          {encodedPath && (
            <div className="mb-4 space-y-1">
              <Typography.Text type="secondary" className="text-xs">
                Base Path（部署后在前面加你的域名，例如 http://192.168.199.82:9530）
              </Typography.Text>
              <pre className="max-h-32 overflow-auto rounded bg-neutral-50 dark:bg-neutral-800 p-2 text-xs whitespace-normal">
                {encodedPath}
              </pre>
              {encodedBaseExample && (
                <>
                  <Typography.Text type="secondary" className="text-xs">
                    当前环境完整示例
                  </Typography.Text>
                  <pre className="max-h-32 overflow-auto rounded bg-neutral-50 dark:bg-neutral-800 p-2 text-xs whitespace-normal">
                    {encodedBaseExample}
                  </pre>
                </>
              )}
            </div>
          )}

          <Form.Item label="请求方法" name="method">
            <Select
              size="large"
              options={[
                { value: "GET", label: "GET" },
                { value: "POST", label: "POST" },
                { value: "PUT", label: "PUT" },
                { value: "DELETE", label: "DELETE" },
                { value: "PATCH", label: "PATCH" },
              ]}
            />
          </Form.Item>

          <Form.Item label="请求体（JSON，可选）" name="body">
            <Input.TextArea rows={4} placeholder='例如：{"username":"admin"}' />
          </Form.Item>

          <Form.Item className="!mb-0">
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                发送请求
              </Button>
              <Button onClick={() => form.resetFields()}>重置表单</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card title="最新响应" className="shadow-sm">
        {last ? (
          <Collapse
            ghost
            defaultActiveKey={["1"]}
            items={[
              {
                key: "1",
                label: <Text>响应数据</Text>,
                children: (
                  <pre className="max-h-80 overflow-auto rounded bg-neutral-50 dark:bg-neutral-800 p-4 text-xs whitespace-normal">
                    {JSON.stringify(last, null, 2)}
                  </pre>
                ),
              },
            ]}
          />
        ) : (
          <Empty
            description="暂无数据，请先发起一次请求"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
    </div>
  );
};

export default CorsProxyPanel;
