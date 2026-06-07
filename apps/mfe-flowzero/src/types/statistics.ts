export enum StatisticsScope {
  ALL = "ALL",
  INITIATOR = "INITIATOR",
  TASK_EXECUTOR = "TASK_EXECUTOR",
}

export type StatisticsInterval = "Day" | "Week" | "Month";

// ---- /api/v1/statistics/request-count ----
export interface RequestCountParams {
  startDate?: string;
  endDate?: string;
  scope?: StatisticsScope;
}

export interface RequestCountVo {
  total?: number;
  open?: number;
  closed?: number;
}

// ---- /api/v1/statistics/pending-distribution ----
export interface PendingDistributionParams {
  workflowName?: string;
  startDate?: string;
  endDate?: string;
  scope?: StatisticsScope;
}

export interface TaskPendingNode {
  taskKey: string;
  taskName?: string;
  pendingCount: number;
}

export interface WorkflowPendingNode {
  workflowKey?: string;
  workflowName?: string;
  pendingCount?: number;
  tasks?: TaskPendingNode[];
}

// ---- /api/v1/statistics/request-trend ----
export interface RequestTrendParams {
  workflowName?: string;
  startDate?: string;
  endDate?: string;
  scope?: StatisticsScope;
  interval?: StatisticsInterval;
}

export interface TrendSeries {
  name?: string;
  values?: number[];
}

export interface RequestTrendVo {
  interval?: StatisticsInterval;
  labels?: string[];
  series?: TrendSeries[];
}
