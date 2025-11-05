"use client";

import { Tag } from "antd";
import {
  CheckCircleTwoTone,
  ExclamationCircleTwoTone,
  CloseCircleTwoTone,
  QuestionCircleTwoTone,
} from "@ant-design/icons";
import type { ApiStatus } from "@services/types";

export default function StatusBadge({ status }: { status: ApiStatus }) {
  if (status === "success") {
    return (
      <Tag color="green" icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}>
        成功
      </Tag>
    );
  }
  if (status === "timeout") {
    return (
      <Tag
        color="gold"
        icon={<ExclamationCircleTwoTone twoToneColor="#faad14" />}
      >
        超时
      </Tag>
    );
  }
  if (status === "error") {
    return (
      <Tag color="red" icon={<CloseCircleTwoTone twoToneColor="#ff4d4f" />}>
        异常
      </Tag>
    );
  }
  return (
    <Tag icon={<QuestionCircleTwoTone twoToneColor="#8c8c8c" />}>未知</Tag>
  );
}

