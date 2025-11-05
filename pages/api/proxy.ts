import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosRequestConfig } from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import { HttpProxyAgent } from "http-proxy-agent";
import https from "https";

type Resp = {
  status: "success" | "timeout" | "error";
  httpStatus: number | null;
  timeCost: number;
  message: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Resp>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      status: "error",
      httpStatus: 405,
      timeCost: 0,
      message: "Method Not Allowed",
    });
  }

  const start = Date.now();
  const {
    url,
    method = "GET",
    headers = {},
    data,
    timeout = 8000,
    passthroughStatus = false,
    headFallbackToGet = true,
    sendBrowserHeaders = true,
    insecureTLS = true,
  } = req.body || {};

  if (!url || typeof url !== "string") {
    return res.status(400).json({
      status: "error",
      httpStatus: 400,
      timeCost: Date.now() - start,
      message: "Invalid url",
    });
  }

  // 按需注入企业代理（HTTPS_PROXY / HTTP_PROXY / NO_PROXY）
  const target = new URL(url);
  const httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  const httpProxy = process.env.HTTP_PROXY || process.env.http_proxy;
  const noProxy = (process.env.NO_PROXY || process.env.no_proxy || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const shouldBypassProxy = noProxy.some(
    (domain) =>
      domain && (target.hostname.endsWith(domain) || target.hostname === domain)
  );

  // 选择代理（https 优先，没有则用 http），并在需要时允许不校验证书
  const proxyUrl = httpsProxy || httpProxy;
  const agent =
    !shouldBypassProxy && proxyUrl
      ? target.protocol === "https:"
        ? new HttpsProxyAgent(proxyUrl)
        : new HttpProxyAgent(proxyUrl)
      : undefined;

  const insecureAgent =
    insecureTLS && target.protocol === "https:"
      ? new https.Agent({ rejectUnauthorized: false })
      : undefined;

  const browserLikeHeaders = sendBrowserHeaders
    ? {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      }
    : {};

  const config: AxiosRequestConfig = {
    url,
    method,
    headers: { ...browserLikeHeaders, ...headers },
    data,
    timeout,
    httpAgent: agent as any,
    httpsAgent: (agent as any) || (insecureAgent as any),
    proxy: false,
    validateStatus: () => true,
  };

  try {
    // 临时关闭 TLS 校验（若启用），仅作用于本次请求
    const prevTLS = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    if (insecureTLS) process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    let response = await axios.request(config);
    // 若为 HEAD 且返回 404/405，则尝试用 GET 重试一次（部分服务未实现 HEAD）
    if (
      method === "HEAD" &&
      headFallbackToGet &&
      (response.status === 404 || response.status === 405)
    ) {
      const remainMs = Math.max(0, timeout - (Date.now() - start));
      response = await axios.request({
        ...config,
        method: "GET",
        timeout: remainMs || 1000,
      });
    }
    if (insecureTLS) process.env.NODE_TLS_REJECT_UNAUTHORIZED = prevTLS as any;
    const timeCost = Date.now() - start;

    const body = {
      status: "success",
      httpStatus: response.status,
      timeCost,
      message: "ok",
      data: {
        statusText: response.statusText,
        headers: response.headers,
        data:
          typeof response.data === "string" && response.data.length > 1000
            ? response.data.slice(0, 1000) + "...<truncated>"
            : response.data,
      },
    } as Resp;

    // 透传目标状态码（可选），否则固定 200，便于前端统一处理
    return res.status(passthroughStatus ? response.status : 200).json(body);
  } catch (error: any) {
    // 复原 TLS 环境变量
    // eslint-disable-next-line no-empty
    try {
      delete (process.env as any).NODE_TLS_REJECT_UNAUTHORIZED;
    } catch {}
    const timeCost = Date.now() - start;
    const isTimeout = error?.code === "ECONNABORTED";
    const isNetwork = error?.message?.includes("Network Error");

    const errBody: Resp = {
      status: isTimeout ? "timeout" : "error",
      httpStatus: error?.response?.status ?? null,
      timeCost,
      message: isTimeout
        ? "timeout"
        : isNetwork
        ? "network error"
        : error?.message || "error",
      data: error?.response?.data,
    };

    const errorHttp = isTimeout
      ? 504
      : isNetwork
      ? 502
      : error?.response?.status || 500;

    return res.status(passthroughStatus ? errorHttp : 200).json(errBody);
  }
}
