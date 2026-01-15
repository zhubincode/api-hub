"use client";

import { useCallback, useState } from "react";
import Card from "./vaporwave/Card";
import Button from "./vaporwave/Button";
import Input from "./vaporwave/Input";
import type { ApiDefinition } from "@services/types";
import request from "@services/request";

type CorsProxyForm = {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
};

const CorsProxyPanel = ({ api }: { api: ApiDefinition }) => {
  const [formData, setFormData] = useState<CorsProxyForm>({
    url: "",
    method: "GET",
    body: "",
  });
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState<any | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showResponse, setShowResponse] = useState(false);

  const origin =
    typeof window === "undefined" ? "" : window.location.origin || "";
  const encodedPath = formData.url
    ? `/api/cors-path/${encodeURIComponent(formData.url)}`
    : "";
  const encodedBaseExample =
    origin && encodedPath ? `${origin}${encodedPath}` : "";

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
        let parsedBody: unknown = undefined;
        if (formData.body) {
          try {
            parsedBody = JSON.parse(formData.body);
          } catch {
            setMessage({ type: "error", text: "Body 需要是合法 JSON 字符串" });
            setLoading(false);
            return;
          }
        }

        const resp = await request.post("/api/cors-proxy", {
          target: formData.url,
          method: formData.method,
          body: parsedBody,
        });
        setLast(resp.data);
        setShowResponse(true);
        setMessage({ type: "success", text: "请求成功" });
      } catch (error) {
        setLast({ error: String((error as any)?.message || error) });
        setShowResponse(true);
        setMessage({ type: "error", text: "请求失败" });
      } finally {
        setLoading(false);
      }
    },
    [formData]
  );

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

      {/* 表单卡片 */}
      <Card variant="terminal" title={`&gt; ${api.name}`}>
        <p className="font-mono text-chrome text-sm mb-6 leading-relaxed">
          {api.description}
        </p>

        <form onSubmit={onSubmit} className="space-y-6">
          <Input
            label="目标 URL"
            placeholder="https://192.168.199.251/tgcloud/admin/api/..."
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            required
          />

          {/* Base Path 示例 */}
          {encodedPath && (
            <div className="space-y-3 border-t-2 border-chrome-dark pt-4">
              <div>
                <span className="font-mono text-xs text-chrome uppercase tracking-wider">
                  Base Path（部署后在前面加你的域名）
                </span>
                <pre className="mt-2 max-h-32 overflow-auto border-2 border-neon-magenta/30 bg-black p-3 text-xs font-mono text-neon-cyan whitespace-normal">
                  {encodedPath}
                </pre>
              </div>
              {encodedBaseExample && (
                <div>
                  <span className="font-mono text-xs text-chrome uppercase tracking-wider">
                    当前环境完整示例
                  </span>
                  <pre className="mt-2 max-h-32 overflow-auto border-2 border-neon-cyan/30 bg-black p-3 text-xs font-mono text-neon-cyan whitespace-normal">
                    {encodedBaseExample}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* 请求方法 */}
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
                  method: e.target.value as CorsProxyForm["method"],
                })
              }
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>

          {/* 请求体 */}
          <div className="space-y-2">
            <label className="block font-mono text-sm text-chrome uppercase tracking-wider">
              请求体（JSON，可选）
            </label>
            <textarea
              className="w-full border-2 border-neon-magenta bg-black text-neon-cyan font-mono text-sm px-3 py-2 focus-visible:border-neon-cyan focus-visible:shadow-[0_0_15px_#00FFFF] focus-visible:outline-none transition-all duration-200 min-h-[100px]"
              placeholder='例如：{"username":"admin"}'
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
            >
              {loading ? "发送中..." : "📡 发送请求"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => setFormData({ url: "", method: "GET", body: "" })}
            >
              重置
            </Button>
          </div>
        </form>
      </Card>

      {/* 响应卡片 */}
      <Card variant="terminal" title="&gt; 最新响应">
        {last ? (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setShowResponse(!showResponse)}
              className="font-mono text-sm text-neon-cyan hover:text-neon-magenta uppercase tracking-wider transition-colors"
            >
              {showResponse ? "▼" : "▶"} 响应数据
            </button>

            {showResponse && (
              <pre className="max-h-80 overflow-auto border-2 border-neon-magenta/30 bg-black p-4 text-xs font-mono text-neon-cyan whitespace-normal">
                {JSON.stringify(last, null, 2)}
              </pre>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📡</div>
            <p className="font-mono text-chrome uppercase tracking-wider">
              &gt; 暂无数据，请先发起一次请求
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CorsProxyPanel;
