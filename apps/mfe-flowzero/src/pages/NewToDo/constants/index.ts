import type { FilterConfigItem } from "src/components/AdvancedFilterModal";

export const GRID_NAME = `todo-data-grid`;

export const TODO_FILTER_CONFIG: FilterConfigItem[] = [
  {
    label: "Task Name",
    value: "taskName",
    icon: "icon-list-task",
    backgroundColor: "#52C41A",
    condition: [
      { label: "=", value: "=" },
      { label: "in", value: "in" },
    ],
    inputType: "tags",
  },
  {
    label: "Task ID",
    value: "taskId",
    icon: "icon-list-task",
    backgroundColor: "#faad14",
    condition: [
      { label: "=", value: "=" },
      { label: "in", value: "in" },
    ],
    inputType: "tags",
  },
  {
    label: "Assignee",
    value: "assigneeId",
    icon: "icon-user-person-profile",
    backgroundColor: "#0473ea",
    condition: [
      { label: "=", value: "=" },
      { label: "in", value: "in" },
    ],
    inputType: "tags",
  },
  {
    label: "Candidate User",
    value: "candidateUser",
    icon: "icon-user-person-profile",
    backgroundColor: "#f5222d",
    condition: [
      { label: "=", value: "=" },
      { label: "in", value: "in" },
    ],
    inputType: "tags",
  },
  {
    label: "Candidate Group",
    value: "candidateGroup",
    icon: "icon-user-person-profile",
    backgroundColor: "#020b43",
    condition: [
      { label: "=", value: "=" },
      { label: "in", value: "in" },
    ],
    inputType: "tags",
  },
  {
    label: "Created By",
    value: "createdBy",
    icon: "icon-user-person-profile",
    backgroundColor: "#722ed1",
    condition: [
      { label: "=", value: "=" },
      { label: "in", value: "in" },
    ],
    inputType: "tags",
  },
  {
    label: "Last Updated By",
    value: "lastUpdatedBy",
    icon: "icon-user-person-profile",
    backgroundColor: "#13c2c2",
    condition: [{ label: "Between", value: "Between" }],
    inputType: "datetimeRange",
    rangeFieldKeys: ["updatedTimeStart", "updatedTimeEnd"],
  },
  {
    label: "Create Time",
    value: "createTimeRange",
    icon: "icon-calendar",
    backgroundColor: "#eb2f96",
    condition: [{ label: "Between", value: "Between" }],
    inputType: "datetimeRange",
    rangeFieldKeys: ["createdTimeStart", "createdTimeEnd"],
  },
];

export const POPOVER_MIN_HEIGHT = 234;
export const POPOVER_BOTTOM_OFFSET = 64;
export const BUTTON_POPOVER_GAP = 6;

export const VIEW_TYPE = {
  ASSIGNED_TO_ME: "ASSIGNED_TO_ME",
  WORKFLOW: "WORKFLOW",
  TASK: "TASK",
} as const;

export type ViewType = (typeof VIEW_TYPE)[keyof typeof VIEW_TYPE];

export const ASSIGNED_TO_ME_DEFAULT_COL_KEYS = [
  "workflowName",
  "requestId",
  "taskName",
  "taskId",
  "createdBy",
  "lastUpdatedBy",
  "createTime",
  "updateTime",
];

export const WORKFLOW_DEFAULT_COL_KEYS = [
  "requestId",
  "taskName",
  "taskId",
  "assignee",
  "candidateUser",
  "candidateGroup",
  "createdBy",
  "lastUpdatedBy",
  "createTime",
  "updateTime",
];

export const TASK_DEFAULT_COL_KEYS = [
  "requestId",
  "taskId",
  "assignee",
  "candidateUser",
  "candidateGroup",
  "createdBy",
  "lastUpdatedBy",
  "createTime",
  "updateTime",
];

export const VIEW_TYPE_DEFAULT_COL_KEYS: Record<ViewType, string[]> = {
  [VIEW_TYPE.ASSIGNED_TO_ME]: ASSIGNED_TO_ME_DEFAULT_COL_KEYS,
  [VIEW_TYPE.WORKFLOW]: WORKFLOW_DEFAULT_COL_KEYS,
  [VIEW_TYPE.TASK]: TASK_DEFAULT_COL_KEYS,
};
