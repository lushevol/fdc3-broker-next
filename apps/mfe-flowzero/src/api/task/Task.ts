import { Service } from "src/Root/import";
import type {
  BatchOperationDto,
  BatchOperationResultVo,
  TaskListCountVo,
  TaskPageQueryParams,
  TaskPageResponse,
} from "src/types/task";

import { DEFAULT_HEADERS, WORKFLOW } from "../index";

const { service } = Service;

// 1. Get current user's pending-claim tasks
export const getPendingClaimList = (params: TaskPageQueryParams) =>
  service.get<TaskPageQueryParams, TaskPageResponse>(
    `${WORKFLOW}/tasks/pending-claim-list`,
    { params, headers: DEFAULT_HEADERS }
  );

// 2. Get team tasks for current user
export const getTeamTaskList = (params: TaskPageQueryParams) =>
  service.get<TaskPageQueryParams, TaskPageResponse>(
    `${WORKFLOW}/tasks/team-task-list`,
    { params, headers: DEFAULT_HEADERS }
  );

// 3. Batch claim tasks
export const batchClaimTasks = (data: BatchOperationDto) =>
  service.post<BatchOperationDto, BatchOperationResultVo>(
    `${WORKFLOW}/tasks/batch/claim`,
    data,
    { headers: DEFAULT_HEADERS }
  );

// 4. Batch assign tasks
export const batchAssignTasks = (data: BatchOperationDto) =>
  service.post<BatchOperationDto, BatchOperationResultVo>(
    `${WORKFLOW}/tasks/batch/assign`,
    data,
    { headers: DEFAULT_HEADERS }
  );

// 5. Get task counts for all three todo tabs
export const getTaskCounts = () =>
  service.get<void, TaskListCountVo>(`${WORKFLOW}/tasks/counts`, {
    headers: DEFAULT_HEADERS,
  });
