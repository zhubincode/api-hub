import type { NextApiRequest, NextApiResponse, PageConfig } from "next";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import https from "https";

interface CorsPathErrorResp {
  message: string;
  error?: unknown;
}

// 禁用 Next.js 默认的 body 解析，以支持 multipart/form-data 透传
export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

// 从原始请求中读取 body buffer
const getRawBody = (req: NextApiRequest): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
};

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
    return res.status(400).json({ message: "Missing encoded base in path" });
  }

  let baseUrl: string;
  try {
    baseUrl = decodeURIComponent(encodedBase);
  } catch (error) {
    return res.status(400).json({ message: "Invalid encoded base", error });
  }

  const joinedPath = restPath.join("/");
  let targetUrl = joinedPath
    ? `${baseUrl.replace(/\/+$/, "")}/${joinedPath}`
    : baseUrl;

  // 提取原始请求中的查询参数（排除 parts 路径参数）并附加到目标 URL
  const queryParams = { ...req.query };
  delete queryParams.parts;
  const queryString = new URLSearchParams(
    queryParams as Record<string, string>
  ).toString();
  if (queryString) {
    targetUrl += (targetUrl.includes("?") ? "&" : "?") + queryString;
  }

  const method = (req.method || "GET").toUpperCase();

  // 透传原始 Content-Type（支持 multipart/form-data、application/json 等）
  const contentType = req.headers["content-type"] || "application/json";
  const headers: Record<string, string | string[] | undefined> = {
    Accept: "application/json, text/plain, */*",
  };

  headers["Content-Type"] = contentType;

  // 规范化上游传入的 Authorization 头，处理 Bearer "xxx" 多一层引号的情况
  const rawAuth =
    (req.headers["authorization"] as string | undefined) ||
    (req.headers["Authorization"] as string | undefined);
  if (rawAuth) {
    const trimmed = rawAuth.trim();
    const match = trimmed.match(/^Bearer\s+"(.+)"$/);
    headers.Authorization = match ? `Bearer ${match[1]}` : trimmed;
  }

  // 读取原始 body（支持 multipart/form-data）
  let bodyData: Buffer | undefined;
  if (method !== "GET" && method !== "HEAD") {
    try {
      bodyData = await getRawBody(req);
    } catch {
      // 忽略读取错误，可能没有 body
    }
  }

  const axiosConfig: AxiosRequestConfig = {
    url: targetUrl,
    method,
    headers,
    data: bodyData,
    timeout: 30000, // FormData 上传可能较慢，增加超时
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    validateStatus: () => true,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
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
