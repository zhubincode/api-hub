import request from "./request";
import type { ProxyRequestPayload, TestResult } from "./types";
import dayjs from "dayjs";

function normalizeErrorMessage(err: any): string {
  if (err?.code === "ECONNABORTED") return "timeout";
  if (err?.message?.includes("Network Error")) return "network error";
  if (err?.response?.status) return `http ${err.response.status}`;
  return "unknown error";
}

export async function testConnectivity(
  payload: ProxyRequestPayload
): Promise<TestResult> {
  const start = Date.now();
  try {
    const resp = await request.post("/api/proxy", payload);
    const timeCost = Date.now() - start;

    const data = resp.data as {
      status: "success" | "timeout" | "error";
      httpStatus: number | null;
      timeCost: number;
      message: string;
      data?: any;
    };

    return {
      status: data.status,
      httpStatus: data.httpStatus ?? resp.status ?? null,
      timeCost: data.timeCost ?? timeCost,
      message: data.message ?? "",
      data: data.data,
      timestamp: dayjs().valueOf(),
    };
  } catch (error: any) {
    const timeCost = Date.now() - start;
    return {
      status: error?.code === "ECONNABORTED" ? "timeout" : "error",
      httpStatus: error?.response?.status ?? null,
      timeCost,
      message: normalizeErrorMessage(error),
      data: error?.response?.data,
      timestamp: dayjs().valueOf(),
    };
  }
}
