import { FieldDataType } from "src/pages/FieldsManagement/fieldType";

export interface TaskNode {
  taskKey: string;
  taskName: string;
}

export interface WorkflowNode {
  workflowIds: string[];
  workflowName: string;
  tasks: TaskNode[];
}

export type TodoStatus = "pending" | "in-progress" | "completed";
export type SortDirection = "ASC" | "DESC";
export type UserSettingsType = "TODO_COLUMNS" | "NAVIGATION_FAVOURITES";

export interface GetTodosParams {
  workflowName?: string;
  taskName?: string;
  taskId?: string;
  createdBy?: string;
  lastUpdatedBy?: string;
  requestId?: string;
  assigneeId?: string;
  updatedTimeStart?: string;
  updatedTimeEnd?: string;
  createStartDateTime?: string;
  createEndDateTime?: string;
  status?: TodoStatus;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
  assigneeOnly?: boolean;
}

export interface TodoItem {
  taskId: string;
  taskName: string;
  candidateUser?: string | null;
  candidateGroup?: string | null;
  assignee?: string | null;
  status: TodoStatus;
  workflowName: string;
  requestId: string;
  createdBy: string;
  lastUpdatedBy: string;
  createTime: string;
  assigneeId?: string | null;
  assigneeName?: string | null;
  dueDate?: string | null;
  variables?: Record<string, unknown>;
}

export interface GetAssignableUsersParams {
  workflowName: string;
  workflowId?: string;
  taskName: string;
}

export interface AssignableUserVo {
  id: string;
  bankId: string;
  userName: string;
  countryCode: string;
  email: string;
  roleName: string;
}

export interface ColumnSetting {
  fieldId: string;
  dataType?: FieldDataType;
  label: string;
  visible: boolean;
  order: number;
  options?: Array<{ value: string; label: string }>;
}

export interface UserSettingsVo {
  userId: string;
  type: UserSettingsType;
  name: string;
  settings: {
    columns: ColumnSetting[];
  };
  updatedAt: string;
}

export interface SaveUserSettingsRequest {
  settings: {
    columns: ColumnSetting[];
  };
}

export interface SaveUserSettingsVo {
  userId: string;
  type: UserSettingsType;
  name: string;
  updatedAt: string;
}
