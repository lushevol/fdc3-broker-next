import { Service } from "src/Root/import";
import type {
  AssignableUserVo,
  GetAssignableUsersParams,
  GetTodosParams,
  SaveUserSettingsRequest,
  SaveUserSettingsVo,
  TodoItem,
  UserSettingsType,
  UserSettingsVo,
  WorkflowNode,
} from "src/types/todo";
import type {
  toDoActionRequest,
  ToDoListParams,
  toDORejectRequest,
} from "src/types/workflow";

import {
  buildQueryString,
  DEFAULT_HEADERS,
  ListResponse,
  todoEntity,
  WORKFLOW,
} from "../index";

export type ExtensionProperty = { name: string; value: string };

const { service } = Service;

export const getToDoList = (params: ToDoListParams) => {
  const queryParams = buildQueryString(params);
  return service.get<ListResponse<todoEntity[]>, ListResponse<todoEntity[]>>(
    `${WORKFLOW}/tasks/todo-list?${queryParams}`,
    { headers: DEFAULT_HEADERS }
  );
};

export const getToDoDetail = (taskId: string) =>
  service.get(`${WORKFLOW}/tasks/detail/${taskId}`, {
    headers: DEFAULT_HEADERS,
  });

export const getExtenstonProperies = (taskId: string) =>
  service.get<undefined, ExtensionProperty[]>(
    `${WORKFLOW}/tasks/extension-properties/${taskId}`,
    { headers: DEFAULT_HEADERS }
  );

export const approveToDo = (params: toDoActionRequest) =>
  service.post(`${WORKFLOW}/tasks/approve`, params, {
    headers: DEFAULT_HEADERS,
  });

export const rejectToDo = (params: toDORejectRequest) =>
  service.post(`${WORKFLOW}/tasks/reject`, params, {
    headers: DEFAULT_HEADERS,
  });

export const terminate = (params: any) =>
  service.post(`${WORKFLOW}/tasks/terminate/`, params, {
    headers: DEFAULT_HEADERS,
  });

export const getTodos = (params: GetTodosParams) =>
  service.get<ListResponse<TodoItem[]>, ListResponse<TodoItem[]>>(
    `${WORKFLOW}/tasks/inbox`,
    { params, headers: DEFAULT_HEADERS }
  );

export const getAssignableUsers = (params: GetAssignableUsersParams) =>
  service.get<GetAssignableUsersParams, AssignableUserVo[]>(
    `${WORKFLOW}/tasks/assignable-users`,
    { params, headers: DEFAULT_HEADERS }
  );

export const getWorkflowNavigation = () =>
  service.get<void, WorkflowNode[]>(`${WORKFLOW}/workflow/navigation`, {
    headers: DEFAULT_HEADERS,
  });

export const getUserSettings = (type: UserSettingsType, name: string) =>
  service.get<void, UserSettingsVo>(
    `${WORKFLOW}/user/settings/${type}/${name}`,
    { headers: DEFAULT_HEADERS }
  );

export const saveUserSettings = (
  type: UserSettingsType,
  name: string,
  data: SaveUserSettingsRequest
) =>
  service.put<SaveUserSettingsRequest, SaveUserSettingsVo>(
    `${WORKFLOW}/user/settings/${type}/${name}`,
    data,
    { headers: DEFAULT_HEADERS }
  );

export const deleteUserSettings = (type: UserSettingsType, name: string) =>
  service.delete(`${WORKFLOW}/user/settings/${type}/${name}`, {
    headers: DEFAULT_HEADERS,
  });
