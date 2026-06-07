export enum EnableStatus {
  Disable = 0,
  Enable = 1,
}

export interface GetModelListParams {
  page?: number;
  size?: number;
  status?: string;
  workflowName?: string;
  name?: string;
  countryCodes?: string;
  ownerIds?: string;
  businessArea?: string;
}

export interface ToDoListParams {
  page?: number;
  size?: number;
  userId?: string;
  name?: string;
}

export interface TaskCenterParams {
  page?: number;
  size?: number;
  userId?: string;
  workflowName?: string;
  status?: string;
}
export interface workflowManagementList {
  bpmnProcessId: string;
  countryCode: string;
  createdAt: null;
  createdBy: string;
  description: string;
  id: number;
  name: string;
  ownerId: string;
  sla: number;
  status: number;
  updatedAt: null;
  updatedBy: string;
}

export interface CreateWorkflowParams {
  name?: string;
  version?: string;
  countryCodes: string;
  ownerId?: string;
  description?: string;
  createdBy?: string;
}

export interface SaveDraftParams {
  name?: string;
  id?: string;
  ownerIds?: string | null;
  countryCodes?: string | null;
  description?: string;
  businessArea?: string;
  content?: string;
  icon?: string;
  rels?: Array<{
    formId: string;
    workflowVariables: string;
  }>;
}

export interface publishParams {
  id: string;
  stopType: string;
}

/**
 * Parameters for workflow deployment
 * @property bpmnContent - BPMN file content
 * @property deployType - 0 for draft, 1 for publish
 * @property key - unique key identifier
 * @property deploymentName - deployment name
 */
export interface DeployParams {
  bpmnContent: string;
  deployType: number;
  key: string;
  deploymentName: string;
}

export interface processInstancesStartParams {
  workflowId: string;
  uniqueVersionId: string;
  variables?: Object;
}

export interface toDoActionRequest {
  taskId?: string;
  comment?: string;
  variables?: Record<string, any>;
}

export interface toDORejectRequest {
  taskId: string;
  comment: string;
  variables?: Record<string, any>;
}

export interface GetFieldsParams {
  page?: number;
  size?: number;
  createdBy?: string;
  status?: string;
  label?: string;
  dataType?: string;
  uiType?: string;
  usedInInboxSearching?: "Y" | "N";
  usedInReporting?: "Y" | "N";
}

export interface MetaDataItem {
  id?: string;
  name?: string;
  desc?: string;
  default?: boolean;
}

export type createFieldsParams = Array<{
  type?: string;
  label?: string;
  dataType?: string;
  status?: string;
  usedInReporting?: string;
  usedInInboxSearching?: string;
  usedInWorkflowVariable?: string;
  metaData?: MetaDataItem[];
}>;

export interface UpdateFieldsParams {
  id: string;
  type?: string;
  label?: string;
  dataType?: string;
  status?: string;
  usedInReporting?: string;
  usedInInboxSearching?: string;
  usedInWorkflowVariable?: string;
  metaData?: MetaDataItem[];
}

export interface DisableFieldsParams {
  id: string;
  status: string;
}

export interface DeleteFieldsParams {
  id: string;
}

export interface ListResponse<T> {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  data: T[];
}
