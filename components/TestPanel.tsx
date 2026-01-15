"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
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
import Card from "./vaporwave/Card";
import Button from "./vaporwave/Button";
import Input from "./vaporwave/Input";
import StatusBadge from "./vaporwave/StatusBadge";
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
  const [formData, setFormData] = useState<ConnectivityForm>({
    url: "",
    method: "HEAD",
    timeout: 8000,
    passthroughStatus: true,
    headFallbackToGet: true,
    sendBrowserHeaders: true,
    insecureTLS: true,
  });
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState<TestResult | null>(null);
  const [history, setHistory] = useState<TestResult[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.url) {
        setMessage({ type: "error", text: "请输入目标 URL" });
        return;
      }

      setLoading(true);
      setMessage(null);
      try {
        const res = await testConnectivity(formData);
        setLast(res);
        setHistory((prev) => [res, ...prev].slice(0, 50));
        setMessage({ type: "success", text: "检测完成" });
      } catch (error) {
        setMessage({ type: "error", text: "检测失败，请重试" });
      } finally {
        setLoading(false);
      }
    },
    [formData]
  );

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    setLast(null);
    localStorage.removeItem(storageKey);
    setMessage({ type: "success", text: "已清除历史记录" });
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
    setMessage({ type: "success", text: "数据已导出" });
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
      {/* 消息提示 */}
      {message && (
        <div
          className={`border-2 p-4 font-mono text-sm ${
            message.type === "success"
              ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan"
              : "border-neon-magenta bg-neon-magenta/10 text-neon-magenta"
          }`}
        >
          &gt; {message.text}
        </div>
      )}

      {/* 统计概览 */}
      {history.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card variant="terminal">
            <div className="text-center">
              <div className="text-4xl font-heading font-black text-neon-cyan drop-shadow-glow-cyan">
                {history.length}
              </div>
              <div className="font-mono text-xs text-chrome mt-2 uppercase tracking-wider">
                测试次数
              </div>
            </div>
          </Card>
          <Card variant="terminal">
            <div className="text-center">
              <div
                className={`text-4xl font-heading font-black drop-shadow-glow-cyan ${
                  successRate >= 80 ? "text-neon-cyan" : "text-neon-magenta"
                }`}
              >
                {successRate}%
              </div>
              <div className="font-mono text-xs text-chrome mt-2 uppercase tracking-wider">
                成功率
              </div>
            </div>
          </Card>
          <Card variant="terminal">
            <div className="text-center">
              <div className="text-4xl font-heading font-black text-neon-orange drop-shadow-glow-cyan">
                {avgTimeCost}
              </div>
              <div className="font-mono text-xs text-chrome mt-2 uppercase tracking-wider">
                平均耗时(ms)
              </div>
            </div>
          </Card>
          <Card variant="terminal">
            <div className="text-center">
              <div className="text-xl font-mono font-bold text-neon-cyan uppercase">
                {last?.status || "未知"}
              </div>
              <div className="font-mono text-xs text-chrome mt-2 uppercase tracking-wider">
                最新状态
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 参数输入 */}
      <Card variant="terminal" title="&gt; 参数配置">
        <form onSubmit={onSubmit} className="space-y-6">
          <Input
            label="目标 URL"
            placeholder="http://internal-nginx-your-service/healthz"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block font-mono text-sm text-chrome uppercase tracking-wider">
                请求方法
              </label>
              <select
                className="w-full border-b-2 border-neon-magenta bg-black text-neon-cyan font-mono text-lg px-3 py-2 focus-visible:border-neon-cyan focus-visible:shadow-[0_0_15px_#00FFFF] focus-visible:outline-none transition-all duration-200"
                value={formData.method}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    method: e.target.value as "GET" | "HEAD",
                  })
                }
              >
                <option value="GET">GET</option>
                <option value="HEAD">HEAD</option>
              </select>
            </div>

            <Input
              label="超时时间 (ms)"
              type="number"
              value={formData.timeout}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  timeout: parseInt(e.target.value) || 8000,
                })
              }
            />
          </div>

          {/* 高级选项 */}
          <div className="border-t-2 border-chrome-dark pt-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="font-mono text-sm text-neon-cyan hover:text-neon-magenta uppercase tracking-wider transition-colors"
            >
              {showAdvanced ? "▼" : "▶"} 高级选项
            </button>

            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {[
                  { key: "passthroughStatus", label: "严格返回目标状态码" },
                  {
                    key: "headFallbackToGet",
                    label: "HEAD 不支持时用 GET 重试",
                  },
                  { key: "sendBrowserHeaders", label: "发送浏览器标准头部" },
                  { key: "insecureTLS", label: "忽略 TLS 证书校验" },
                ].map((option) => (
                  <label
                    key={option.key}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={
                        formData[
                          option.key as keyof ConnectivityForm
                        ] as boolean
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [option.key]: e.target.checked,
                        })
                      }
                      className="w-5 h-5 accent-neon-cyan"
                    />
                    <span className="font-mono text-sm text-chrome">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
            >
              {loading ? "检测中..." : "⚡ 立即检测"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() =>
                setFormData({
                  url: "",
                  method: "HEAD",
                  timeout: 8000,
                  passthroughStatus: true,
                  headFallbackToGet: true,
                  sendBrowserHeaders: true,
                  insecureTLS: true,
                })
              }
            >
              重置
            </Button>
          </div>
        </form>
      </Card>

      {/* 最新结果 */}
      <Card variant="terminal" title="&gt; 最新检测结果">
        {last ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-chrome">
                {dayjs(last.timestamp).format("YYYY-MM-DD HH:mm:ss")}
              </span>
              <StatusBadge status={last.status as any} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border-2 border-neon-cyan/30 bg-neon-cyan/5 p-4 text-center">
                <div className="text-4xl font-heading font-black text-neon-cyan">
                  {last.httpStatus ?? "-"}
                </div>
                <div className="font-mono text-xs text-chrome mt-2 uppercase">
                  HTTP 状态
                </div>
              </div>
              <div className="border-2 border-neon-magenta/30 bg-neon-magenta/5 p-4 text-center">
                <div className="text-4xl font-heading font-black text-neon-magenta">
                  {last.timeCost}
                </div>
                <div className="font-mono text-xs text-chrome mt-2 uppercase">
                  响应时间(ms)
                </div>
              </div>
              <div className="border-2 border-neon-orange/30 bg-neon-orange/5 p-4 text-center">
                <div className="text-2xl font-mono font-bold text-neon-orange uppercase">
                  {last.status}
                </div>
                <div className="font-mono text-xs text-chrome mt-2 uppercase">
                  状态
                </div>
              </div>
              <div className="border-2 border-chrome-dark bg-void-light/50 p-4 text-center">
                <div className="text-sm font-mono text-chrome truncate">
                  {last.message || "OK"}
                </div>
                <div className="font-mono text-xs text-chrome mt-2 uppercase">
                  消息
                </div>
              </div>
            </div>

            <details className="border-t-2 border-chrome-dark pt-4">
              <summary className="font-mono text-sm text-neon-cyan cursor-pointer hover:text-neon-magenta uppercase tracking-wider">
                查看完整响应数据
              </summary>
              <pre className="mt-4 max-h-80 overflow-auto border-2 border-neon-magenta/30 bg-black p-4 text-xs font-mono text-neon-cyan">
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
            </details>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <p className="font-mono text-chrome uppercase tracking-wider">
              &gt; 暂无数据，请先进行检测
            </p>
          </div>
        )}
      </Card>

      {/* 响应时间曲线 */}
      <Card variant="terminal" title="&gt; 响应时间趋势">
        {history.length ? (
          <div className="space-y-4">
            <div className="flex gap-4 justify-end">
              <Button variant="outline" size="sm" onClick={handleExportData}>
                💾 导出数据
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleClearHistory}
              >
                🗑️ 清除历史
              </Button>
            </div>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D1B4E" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: "#E0E0E0" }}
                    stroke="#E0E0E0"
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#E0E0E0" }}
                    stroke="#E0E0E0"
                    label={{
                      value: "响应时间 (ms)",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#E0E0E0" },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a103c",
                      border: "2px solid #00FFFF",
                      borderRadius: 0,
                      color: "#E0E0E0",
                      fontFamily: "monospace",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="timeCost"
                    stroke="#00FFFF"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#FF00FF",
                      stroke: "#00FFFF",
                      strokeWidth: 2,
                    }}
                    activeDot={{ r: 6, fill: "#00FFFF" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📈</div>
            <p className="font-mono text-chrome uppercase tracking-wider">
              &gt; 暂无历史数据
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
