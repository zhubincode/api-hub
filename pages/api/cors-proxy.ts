import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import https from "https";

interface CorsProxyRequestBody {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  insecureTLS?: boolean;
}

// 通用跨域代理接口：通过 query.target 或 body.url 指定目标地址
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { target } = req.query;
  const queryTarget = Array.isArray(target) ? target[0] : target;

  const {
    method = req.method || "GET",
    headers = {},
    body,
    timeout = 15000,
    insecureTLS = true,
  } = (req.body || {}) as CorsProxyRequestBody & { url?: string };

  const bodyAny = req.body as { url?: string; target?: string } | undefined;
  const urlFromBody = bodyAny?.url || bodyAny?.target;
  const url = queryTarget || urlFromBody;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ message: "Invalid url" });
  }

  const requestHeaders: Record<string, string | string[] | undefined> = {
    // 默认只带最小必要头，避免浏览器 Origin / Referer / Cookie 等影响权限判断
    Accept: "application/json, text/plain, */*",
    "Content-Type": body ? "application/json" : undefined,
    ...headers,
  };

  delete requestHeaders["content-length"];
  delete requestHeaders["accept-encoding"];

  const axiosConfig: AxiosRequestConfig = {
    url,
    method: (method || "GET").toUpperCase(),
    headers: requestHeaders,
    data: body ?? req.body,
    timeout,
    httpsAgent: insecureTLS
      ? new https.Agent({ rejectUnauthorized: false })
      : undefined,
    validateStatus: () => true,
  };

  try {
    const response = await axios.request(axiosConfig);
    return res.status(response.status).json(response.data);
  } catch (err: unknown) {
    const error = err as AxiosError;
    const status = error.response?.status || 500;
    return res.status(status).json({
      message: error.message || "proxy error",
      error: error.response?.data,
    });
  }
};

export default handler;
