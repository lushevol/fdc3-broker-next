import type { ICellRendererParams } from "ag-grid-community";
import React from "react";
import {
  StatusBadge,
  type StatusBadgeConfig,
} from "src/components/DataGrid/StatusBadge";

const STATUS_CONFIG: Record<string, StatusBadgeConfig> = {
  ACTIVE: {
    label: "ACTIVE",
    bgClass: "bg-[#CCE5FF]",
    textClass: "text-[#035CBB]",
    darkBgclass: "dark:bg-[#00172e]",
    darkTextClass: "dark:text-[#368FEE]",
  },
  DISABLED: {
    label: "DISABLED",
    bgClass: "bg-[#D9D9D9]",
    textClass: "text-[#808080]",
    darkBgclass: "dark:bg-[#262626]",
    darkTextClass: "dark:text-[#808080]",
  },
};

const StatusCellRenderer: React.FC<ICellRendererParams> = (params) => {
  const hasValidData =
    params.data?.id !== undefined && params.data?.id !== null;
  if (!params.value || !hasValidData) return null;
  const config = STATUS_CONFIG[params.value as string];
  if (!config) return <span>{params.value}</span>;
  return <StatusBadge config={config} />;
};

export default StatusCellRenderer;
