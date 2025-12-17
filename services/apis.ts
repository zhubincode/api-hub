import type { ApiDefinition } from "./types";

export const API_LIST: ApiDefinition[] = [
  {
    key: "connectivity",
    name: "前端部署服务连通性检测",
    description:
      "通过后端代理访问内部 Nginx / 服务地址，返回 HTTP 状态码、响应时间与错误类型（404/500/timeout/network error）。",
    method: "POST",
    path: "/api/proxy",
  },
  {
    key: "cors-proxy",
    name: "通用跨域代理测试",
    description:
      "通过后端通用代理接口转发任意 HTTP 请求，解决浏览器跨域限制，支持自定义方法和请求体。",
    method: "POST",
    path: "/api/cors-proxy",
  },
];

export function getApiByKey(key?: string | string[]) {
  const k = Array.isArray(key) ? key[0] : key;
  return API_LIST.find((x) => x.key === k);
}
