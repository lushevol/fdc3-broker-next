export type SortDirection = "ASC" | "DESC";

export type BatchStatus = "SUCCESS" | "PARTIAL_SUCCESS" | "FAILED";

export type ItemStatus = "SUCCESS" | "FAILED";

export interface TaskVo {
  id?: string;
  name?: string;
  taskDefinitionKey?: string;
  processDefinitionId?: string;
  processInstanceId?: string;
  assignee?: string;
  createTime?: string;
  workflowName?: string;
  requester?: string;
  dueDate?: string;
  variables?: Record<string, unknown>;
}

export interface TaskPageQueryParams {
  name?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
}

export interface TaskPageResponse {
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  data?: TaskVo[];
}

export interface NameValueVo {
  name?: string;
  value?: string;
}

export interface BatchOperationDto {
  IdList: string[];
  toUserId: string;
}

export interface BatchItemResultVo {
  id?: string;
  status?: ItemStatus;
  message?: string;
}

export interface BatchOperationResultVo {
  status?: BatchStatus;
  results?: BatchItemResultVo[];
}

export interface TaskListCountVo {
  pendingHandleCount: number;
  pendingClaimCount: number;
  teamTaskCount: number;
}
