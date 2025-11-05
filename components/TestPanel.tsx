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
  Collapse,
  Statistic,
  Row,
  Col,
  message,
} from "antd";
import {
  DeleteOutlined,
  DownloadOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
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
        insecureTLS: values.insecureTLS,
      });
      setLast(res);
      setHistory((prev) => [res, ...prev].slice(0, 50));
      message.success("检测完成");
    } catch (error) {
      message.error("检测失败，请重试");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    setLast(null);
    localStorage.removeItem(storageKey);
    message.success("已清除历史记录");
  }, [storageKey]);

  const handleExportData = useCallback(() => {
    const dataStr = JSON.stringify(history, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `api-test-${api.key}-${dayjs().format(
      "YYYYMMDDHHmmss"
    )}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success("数据已导出");
  }, [history, api.key]);

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

  const avgTimeCost = useMemo(() => {
    if (!history.length) return 0;
    const sum = history.reduce((acc, item) => acc + item.timeCost, 0);
    return Math.round(sum / history.length);
  }, [history]);

  const successRate = useMemo(() => {
    if (!history.length) return 0;
    const successCount = history.filter(
      (item) => item.status === "success"
    ).length;
    return Math.round((successCount / history.length) * 100);
  }, [history]);

  return (
    <div className="space-y-6">
      {/* 统计概览 */}
      {history.length > 0 && (
        <Row gutter={16}>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic title="测试次数" value={history.length} suffix="次" />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic
                title="成功率"
                value={successRate}
                suffix="%"
                valueStyle={{
                  color: successRate >= 80 ? "#3f8600" : "#cf1322",
                }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic title="平均耗时" value={avgTimeCost} suffix="ms" />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small">
              <Statistic
                title="最新状态"
                value={last?.status || "未知"}
                valueStyle={{
                  color:
                    last?.status === "success"
                      ? "#3f8600"
                      : last?.status === "error"
                      ? "#cf1322"
                      : "#d48806",
                }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* 参数输入 */}
      <Card title="参数配置" className="shadow-sm">
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
              size="large"
              placeholder="http://internal-nginx-your-service/healthz"
              allowClear
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="请求方法" name="method">
                <Select
                  size="large"
                  options={[
                    { value: "GET", label: "GET" },
                    { value: "HEAD", label: "HEAD" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="超时时间（ms）" name="timeout">
                <Input size="large" type="number" min={1000} step={500} />
              </Form.Item>
            </Col>
          </Row>

          {/* 高级选项折叠面板 */}
          <Collapse
            ghost
            items={[
              {
                key: "1",
                label: "高级选项",
                children: (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                      label="严格返回目标状态码"
                      name="passthroughStatus"
                      valuePropName="checked"
                      tooltip="开启后，代理 API 将透传目标服务的 HTTP 状态码"
                    >
                      <Switch />
                    </Form.Item>
                    <Form.Item
                      label="HEAD 不支持时用 GET 重试"
                      name="headFallbackToGet"
                      valuePropName="checked"
                      tooltip="部分服务未实现 HEAD 方法时自动降级为 GET"
                    >
                      <Switch />
                    </Form.Item>
                    <Form.Item
                      label="发送浏览器标准头部"
                      name="sendBrowserHeaders"
                      valuePropName="checked"
                      tooltip="携带 User-Agent、Accept 等标准浏览器头部"
                    >
                      <Switch />
                    </Form.Item>
                    <Form.Item
                      label="忽略 TLS 证书校验"
                      name="insecureTLS"
                      valuePropName="checked"
                      tooltip="等价于 curl -k，用于测试自签名证书服务"
                    >
                      <Switch />
                    </Form.Item>
                  </div>
                ),
              },
            ]}
          />

          <Form.Item className="!mb-0 !mt-6">
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                icon={<ThunderboltOutlined />}
              >
                立即检测
              </Button>
              <Button size="large" onClick={() => form.resetFields()}>
                重置表单
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 最新结果 */}
      <Card
        title="最新检测结果"
        className="shadow-sm"
        extra={
          <StatusBadge status={(last?.status ?? "unknown") as ApiStatus} />
        }
      >
        {last ? (
          <div className="space-y-4">
            <Typography.Text type="secondary" className="text-sm">
              检测时间：{dayjs(last.timestamp).format("YYYY-MM-DD HH:mm:ss")}
            </Typography.Text>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <div className="text-center p-3 bg-gray-50 dark:bg-neutral-800 rounded">
                  <div className="text-2xl font-bold text-blue-500">
                    {last.httpStatus ?? "-"}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">HTTP 状态</div>
                </div>
              </Col>
              <Col span={6}>
                <div className="text-center p-3 bg-gray-50 dark:bg-neutral-800 rounded">
                  <div className="text-2xl font-bold text-green-500">
                    {last.timeCost}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">响应时间(ms)</div>
                </div>
              </Col>
              <Col span={6}>
                <div className="text-center p-3 bg-gray-50 dark:bg-neutral-800 rounded">
                  <div className="text-2xl font-bold">{last.status}</div>
                  <div className="text-xs text-gray-500 mt-1">状态</div>
                </div>
              </Col>
              <Col span={6}>
                <div className="text-center p-3 bg-gray-50 dark:bg-neutral-800 rounded">
                  <div className="text-sm font-medium truncate">
                    {last.message || "OK"}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">消息</div>
                </div>
              </Col>
            </Row>
            <Divider className="!my-4" />
            <Collapse
              ghost
              items={[
                {
                  key: "1",
                  label: "查看完整响应数据",
                  children: (
                    <pre className="max-h-80 overflow-auto rounded bg-neutral-50 dark:bg-neutral-800 p-4 text-xs">
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
                  ),
                },
              ]}
            />
          </div>
        ) : (
          <Empty
            description="暂无数据，请先进行检测"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>

      {/* 响应时间曲线 */}
      <Card
        title="响应时间趋势"
        className="shadow-sm"
        extra={
          history.length > 0 && (
            <Space>
              <Button
                size="small"
                icon={<DownloadOutlined />}
                onClick={handleExportData}
              >
                导出数据
              </Button>
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={handleClearHistory}
              >
                清除历史
              </Button>
            </Space>
          )
        }
      >
        {history.length ? (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200 dark:stroke-neutral-700"
                />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#888" />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                  label={{
                    value: "响应时间 (ms)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #ccc",
                    borderRadius: 8,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="timeCost"
                  stroke="#1677ff"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#1677ff" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <Empty
            description="暂无历史数据"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
    </div>
  );
}
