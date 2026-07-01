import type { ICellRendererParams } from "ag-grid-community";
import React from "react";
import {
  StatusBadge,
  type StatusBadgeConfig,
} from "src/components/DataGrid/StatusBadge";

const STATUS_CONFIG: Record<string, StatusBadgeConfig> = {
  INPROGRESS: {
    label: "INPROGRESS",
    bgClass: "bg-[#CCE5FF]",
    textClass: "text-[#035CBB]",
    darkBgclass: "dark:bg-[#00172e]",
    darkTextClass: "dark:text-[#368FEE]",
  },
  COMPLETE: {
    label: "COMPLETE",
    bgClass: "bg-[#D7F7CD]",
    textClass: "text-[#2CA800]",
    darkBgclass: "dark:bg-[#082a00]",
    darkTextClass: "dark:text-[#5FDF37]",
  },
  "MANUAL-TERMINATED": {
    label: "MANUAL-TERMINATED",
    bgClass: "bg-[#D9D9D9]",
    textClass: "text-[#808080]",
    darkBgclass: "dark:bg-[#262626]",
    darkTextClass: "dark:text-[#808080]",
  },
  "AUTO-TERMINATED": {
    label: "AUTO-TERMINATED",
    bgClass: "bg-[#D9D9D9]",
    textClass: "text-[#808080]",
    darkBgclass: "dark:bg-[#262626]",
    darkTextClass: "dark:text-[#808080]",
  },
};

const StatusCellRenderer: React.FC<ICellRendererParams> = (params) => {
  if (!params.value) return null;
  const config = STATUS_CONFIG[params.value as string];
  if (!config) return <span>{params.value}</span>;
  return <StatusBadge className="font-semibold" config={config} />;
};

export default StatusCellRenderer;
