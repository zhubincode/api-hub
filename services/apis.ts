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
];

export function getApiByKey(key?: string | string[]) {
  const k = Array.isArray(key) ? key[0] : key;
  return API_LIST.find((x) => x.key === k);
}

