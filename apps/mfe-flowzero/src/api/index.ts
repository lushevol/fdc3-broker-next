export * from "./candidate/Candidate";
export * from "./field/Field";
export * from "./form/Form";
export * from "./statistics/Statistics";
export * from "./task/Task";
export * from "./todo/Todo";
export * from "./user/User";

import { WorkflowEntity } from "src/pages/workflow/viewModel/WorkflowDesignerStore";
import { Service } from "src/Root/import";
import type { GetUserPageParams } from "src/types/user";
import type {
  CreateWorkflowParams,
  GetModelListParams,
  processInstancesStartParams,
  publishParams,
  SaveDraftParams,
  TaskCenterParams,
} from "src/types/workflow";

const { service } = Service;
export const WORKFLOW: string = "/api/flowzero/v1";
export const DEFAULT_HEADERS = {
  "standard-response": "true",
  "show-loading": "false",
} as const;

export type ListResponse<T> = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  data: T;
};

interface taskCenterEntity {
  requestId: string;
  definitionId: string;
  workflowName: string;
  requestDate: string;
  status: string;
  submitter: string;
}

export interface todoEntity {
  id: string;
  name: string;
  taskDefinitionKey: string;
  processDefinitionId: string;
  processInstanceId: string;
  assignee: string;
  createTime: string;
  workflowName: string;
  requester: string;
  dueDate: string;
  variables: unknown;
}

export const buildQueryString = (params: GetModelListParams): string => {
  return Object.entries(params)
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");
};

// workflow design
export const getModelList = (params: GetModelListParams) => {
  const queryParams = buildQueryString(params);
  return service.get<
    ListResponse<WorkflowEntity[]>,
    ListResponse<WorkflowEntity[]>
  >(
    // `${WORKFLOW}/bpmns?page=${params.pageNum}&size=${params.pageSize}&status=${status}`
    `${WORKFLOW}/workflow/page?${queryParams}`,
    { headers: DEFAULT_HEADERS }
  );
};
export const getBpmnDetail = (bpmnVersionId: string) =>
  service.get<string, WorkflowEntity>(
    `${WORKFLOW}/workflow/detail/${bpmnVersionId}`,
    { headers: DEFAULT_HEADERS }
  );
export const createWorkflow = (data: CreateWorkflowParams) =>
  service.post(`${WORKFLOW}/workflow/create`, data, {
    headers: DEFAULT_HEADERS,
  });

export const checkDuplicateWorkflow = (data: {
  name: string;
  uniqueProcessId?: string;
}) =>
  service.post(`${WORKFLOW}/workflow/check-name`, data, {
    headers: DEFAULT_HEADERS,
  });

type SaveDraftRes = { code: number; id: string; msg: string; status: string };
export const saveDraft = (params: SaveDraftParams) =>
  service.post<SaveDraftParams, SaveDraftRes>(
    `${WORKFLOW}/workflow/save`,
    params,
    { headers: DEFAULT_HEADERS }
  );
export const beforePublishCheck = (workflowId: string) =>
  service.get<string, { runningInstancesNum: number }>(
    `${WORKFLOW}/workflow/before-publish-check/${workflowId}`,
    { headers: DEFAULT_HEADERS }
  );
export const publish = (params: publishParams) =>
  service.post(`${WORKFLOW}/workflow/publish`, params, {
    responseType: "text",
    headers: DEFAULT_HEADERS,
  });
// getNewRequest
export const getNewRequest = (params: GetModelListParams) => {
  const queryParams = buildQueryString(params);
  return service.get(
    `${WORKFLOW}/workflow/published-workflow-page?${queryParams}`,
    {
      headers: DEFAULT_HEADERS,
    }
  );
};
export const processInstancesStart = (params: processInstancesStartParams) =>
  service.post(`${WORKFLOW}/workflow-request/start`, params, {
    headers: DEFAULT_HEADERS,
  });
export const getTaskCenter = (params: TaskCenterParams) => {
  const queryParams = buildQueryString(params);
  return service.get<
    ListResponse<taskCenterEntity[]>,
    ListResponse<taskCenterEntity[]>
  >(`${WORKFLOW}/workflow-request/my-request?${queryParams}`, {
    headers: DEFAULT_HEADERS,
  });
};

export interface CountryItem {
  alpha2Code?: string;
  shortName: string;
}
export const getAllCountries = () =>
  service.get<undefined, CountryItem[]>(`${WORKFLOW}/country/all`, {
    headers: DEFAULT_HEADERS,
  });

// Dictionary
export type FlowzeroDictionnary = {
  dictionary: string;
};

export interface BusinessAreaItem {
  value: string;
  label: string;
}

export const findDictionaryByNames = (names: string[]) =>
  service.post<string, FlowzeroDictionnary[]>(
    `${WORKFLOW}/dictionary/findByNames`,
    names,
    { headers: DEFAULT_HEADERS }
  );

// User
export const getUserPage = (params: GetUserPageParams) => {
  const queryParams = Object.entries(params)
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");
  return service.get(`${WORKFLOW}/user/page?${queryParams}`, {
    headers: DEFAULT_HEADERS,
  });
};
