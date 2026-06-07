export interface WorkflowResponse {
  data: WorkflowItem[];
  totalElements: number;
  totalPages: number;
  size: number;
  page: number;
}

export interface WorkflowItem {
  name: string;
  countryCodes: string;
  ownerIds: string;
  description: string;
  status: string;
  content: string;
  succeedFromId: string;
  businessArea: string;
  buniqueProcessId: string;
  uniqueVersionId: string;
  workflowVersion: number;
  icon: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}
