"use client";

import { Tag } from "antd";
import {
  CheckCircleTwoTone,
  ExclamationCircleTwoTone,
  CloseCircleTwoTone,
  QuestionCircleTwoTone,
} from "@ant-design/icons";
import type { ApiStatus } from "@services/types";

interface StatusConfig {
  color: string;
  icon: JSX.Element;
  text: string;
}

const STATUS_CONFIG: Record<ApiStatus, StatusConfig> = {
  success: {
    color: "success",
    icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
    text: "成功",
  },
  timeout: {
    color: "warning",
    icon: <ExclamationCircleTwoTone twoToneColor="#faad14" />,
    text: "超时",
  },
  error: {
    color: "error",
    icon: <CloseCircleTwoTone twoToneColor="#ff4d4f" />,
    text: "异常",
  },
  unknown: {
    color: "default",
    icon: <QuestionCircleTwoTone twoToneColor="#8c8c8c" />,
    text: "未知",
  },
};

export default function StatusBadge({ status }: { status: ApiStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <Tag color={config.color} icon={config.icon}>
      {config.text}
    </Tag>
  );
}
