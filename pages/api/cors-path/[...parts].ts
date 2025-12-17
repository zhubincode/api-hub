import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import https from "https";

interface CorsPathErrorResp {
  message: string;
  error?: unknown;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<any | CorsPathErrorResp>
) => {
  const parts = (req.query.parts || []) as string[] | string;
  const arr = Array.isArray(parts) ? parts : [parts];

  if (!arr.length) {
    return res.status(400).json({ message: "Missing encoded base in path" });
  }

  const [encodedBase, ...restPath] = arr as string[];

  if (!encodedBase) {
    return res
      .status(400)
      .json({ message: "Missing encoded base in path" });
  }

  let baseUrl: string;
  try {
    baseUrl = decodeURIComponent(encodedBase);
  } catch (error) {
    return res.status(400).json({ message: "Invalid encoded base", error });
  }

  const joinedPath = restPath.join("/");
  const targetUrl = joinedPath
    ? `${baseUrl.replace(/\/+$/, "")}/${joinedPath}`
    : baseUrl;

  const method = (req.method || "GET").toUpperCase();

  // 仅发送最小必要头，避免 Origin / Referer / Cookie 等浏览器头影响后端行为
  const headers: Record<string, string | string[] | undefined> = {
    Accept: "application/json, text/plain, */*",
  };

  if (req.body) {
    headers["Content-Type"] = "application/json";
  }

   // 规范化上游传入的 Authorization 头，处理 Bearer "xxx" 多一层引号的情况
  const rawAuth =
    (req.headers["authorization"] as string | undefined) ||
    (req.headers["Authorization"] as string | undefined);
  if (rawAuth) {
    const trimmed = rawAuth.trim();
    const match = trimmed.match(/^Bearer\s+"(.+)"$/);
    headers.Authorization = match ? `Bearer ${match[1]}` : trimmed;
  }

  const axiosConfig: AxiosRequestConfig = {
    url: targetUrl,
    method,
    headers,
    data: req.body,
    timeout: 15000,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
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
