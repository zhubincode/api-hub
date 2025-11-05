"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Select,
  Typography,
  Divider,
  Empty,
  Switch,
} from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import dayjs from "dayjs";
import { pick } from "lodash-es";
import StatusBadge from "./StatusBadge";
import type { ApiDefinition, ApiStatus, TestResult } from "@services/types";
import { testConnectivity } from "@services/tester";

type ConnectivityForm = {
  url: string;
  method: "GET" | "HEAD";
  timeout?: number;
  passthroughStatus?: boolean;
  headFallbackToGet?: boolean;
  sendBrowserHeaders?: boolean;
  insecureTLS?: boolean;
};

const STORAGE_PREFIX = "api-hub-history:";

export default function TestPanel({ api }: { api: ApiDefinition }) {
  const [form] = Form.useForm<ConnectivityForm>();
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState<TestResult | null>(null);
  const [history, setHistory] = useState<TestResult[]>([]);

  const storageKey = useMemo(() => STORAGE_PREFIX + api.key, [api.key]);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const list: TestResult[] = JSON.parse(raw);
        setHistory(list);
        setLast(list[0] ?? null);
      } catch {}
    }
  }, [storageKey]);

  useEffect(() => {
    if (history.length) {
      localStorage.setItem(storageKey, JSON.stringify(history));
    }
  }, [history, storageKey]);

  const onSubmit = useCallback(async (values: ConnectivityForm) => {
    setLoading(true);
    try {
      const res = await testConnectivity({
        url: values.url,
        method: values.method,
        timeout: values.timeout,
        passthroughStatus: values.passthroughStatus,
        headFallbackToGet: values.headFallbackToGet,
        sendBrowserHeaders: values.sendBrowserHeaders,
      });
      setLast(res);
      setHistory((prev) => [res, ...prev].slice(0, 50));
    } finally {
      setLoading(false);
    }
  }, []);

  const chartData = useMemo(
    () =>
      [...history].reverse().map((item, idx) => ({
        idx,
        timeCost: item.timeCost,
        label: dayjs(item.timestamp).format("HH:mm:ss"),
        status: item.status,
      })),
    [history]
  );

  const defaultUrlPlaceholder = "http://internal-nginx-your-service/healthz";

  return (
    <div className="space-y-4">
      <Card title="参数输入">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            method: "HEAD",
            timeout: 8000,
            passthroughStatus: true,
            headFallbackToGet: true,
            sendBrowserHeaders: true,
            insecureTLS: true,
          }}
          onFinish={onSubmit}
        >
          <Form.Item
            label="目标 URL"
            name="url"
            rules={[{ required: true, message: "请输入目标 URL" }]}
          >
            <Input
              placeholder={defaultUrlPlaceholder}
              allowClear
              inputMode="url"
            />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item label="请求方法" name="method">
              <Select
                options={[
                  { value: "GET", label: "GET" },
                  { value: "HEAD", label: "HEAD" },
                ]}
              />
            </Form.Item>
            <Form.Item label="超时时间（ms）" name="timeout">
              <Input type="number" min={1000} step={500} />
            </Form.Item>
            <Form.Item
              label="严格返回目标状态码"
              name="passthroughStatus"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label="HEAD 不支持时用 GET 重试"
              name="headFallbackToGet"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label="使用浏览器头部（更贴近真实访问）"
              name="sendBrowserHeaders"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label="忽略 TLS 校验（等价 curl -k）"
              name="insecureTLS"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item label=" " colon={false}>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  立即检测
                </Button>
                <Button
                  onClick={() => {
                    form.resetFields();
                  }}
                >
                  重置
                </Button>
              </Space>
            </Form.Item>
          </div>
        </Form>
      </Card>

      <Card
        title="最新结果"
        extra={
          <StatusBadge status={(last?.status ?? "unknown") as ApiStatus} />
        }
      >
        {last ? (
          <div className="space-y-2">
            <Typography.Text type="secondary">
              时间：{dayjs(last.timestamp).format("YYYY-MM-DD HH:mm:ss")}
            </Typography.Text>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div>HTTP 状态：{last.httpStatus ?? "-"}</div>
              <div>耗时：{last.timeCost} ms</div>
              <div>状态：{last.status}</div>
              <div>信息：{last.message || "-"}</div>
            </div>
            <Divider className="my-3" />
            <Typography.Text strong>响应数据：</Typography.Text>
            <pre className="mt-2 max-h-80 overflow-auto rounded bg-neutral-50 dark:bg-neutral-800 p-3 text-xs">
              {JSON.stringify(
                pick(last, [
                  "status",
                  "httpStatus",
                  "timeCost",
                  "message",
                  "data",
                ]),
                null,
                2
              )}
            </pre>
          </div>
        ) : (
          <Empty description="暂无数据，请先检测" />
        )}
      </Card>

      <Card title="响应时间曲线（ms）">
        {history.length ? (
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="timeCost"
                  stroke="#1677ff"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <Empty description="暂无历史数据" />
        )}
      </Card>
    </div>
  );
}
