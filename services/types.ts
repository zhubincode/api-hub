export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD";
export type ApiStatus = "success" | "timeout" | "error" | "unknown";

export interface ApiDefinition {
  key: string;
  name: string;
  description: string;
  method: HttpMethod;
  path: string;
  tags?: string[];
}

export interface ProxyRequestPayload {
  url: string;
  method?: Extract<
    HttpMethod,
    "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD"
  >;
  headers?: Record<string, string>;
  data?: any;
  timeout?: number;
  /** 是否让代理 API 透传目标 HTTP 状态码到响应（便于在浏览器网络面板直观看到真实状态） */
  passthroughStatus?: boolean;
  /** 当使用 HEAD 且返回 404/405 时，是否自动使用 GET 重试一次（避免部分服务未实现 HEAD 导致误判） */
  headFallbackToGet?: boolean;
  /** 为目标请求补充常见浏览器头（UA、Accept、Accept-Language 等） */
  sendBrowserHeaders?: boolean;
  /** 忽略 TLS 证书校验（等价 curl -k） */
  insecureTLS?: boolean;
}

export interface ProxyResponseShape {
  status: ApiStatus;
  httpStatus: number | null;
  timeCost: number;
  message: string;
  data?: any;
}

export interface TestResult extends ProxyResponseShape {
  timestamp: number;
}
