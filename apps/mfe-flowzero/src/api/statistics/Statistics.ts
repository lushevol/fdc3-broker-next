import { Service } from "src/Root/import";
import type {
  PendingDistributionParams,
  RequestCountParams,
  RequestCountVo,
  RequestTrendParams,
  RequestTrendVo,
  WorkflowPendingNode,
} from "src/types/statistics";

import { DEFAULT_HEADERS, WORKFLOW } from "../index";

const { service } = Service;

// 1. Get workflow request total count
export const getRequestCount = (params?: RequestCountParams) =>
  service.get<RequestCountParams, RequestCountVo>(
    `${WORKFLOW}/statistics/request-count`,
    { params, headers: DEFAULT_HEADERS }
  );

// 2. Get pending request distribution by workflow
export const getPendingDistribution = (params?: PendingDistributionParams) =>
  service.get<PendingDistributionParams, WorkflowPendingNode[]>(
    `${WORKFLOW}/statistics/pending-distribution`,
    { params, headers: DEFAULT_HEADERS }
  );

// 3. Get request trend grouped by time interval
export const getRequestTrend = (params?: RequestTrendParams) =>
  service.get<RequestTrendParams, RequestTrendVo>(
    `${WORKFLOW}/statistics/request-trend`,
    { params, headers: DEFAULT_HEADERS }
  );
