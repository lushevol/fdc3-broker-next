import type { WorkflowNode } from "src/types/todo";

export const BASE_PATH = "/flowzero";

export interface MenuItemConfig {
  key: string;
  label: string;
  icon: string;
  route?: string;
  tooltip?: string;
}

export interface MenuGroupConfig {
  label: string;
  items: MenuItemConfig[];
}

export const resolveAssignToDoKey = (
  search: string,
  _navData: WorkflowNode[]
): string => {
  const params = new URLSearchParams(search);
  const wf = params.get("workflowName");
  const tn = params.get("taskName");
  const tk = params.get("taskKey");
  if (wf && tn && tk) return `${wf}__${tn}__${tk}`;
  if (wf && tn) return wf;
  if (wf) return wf;
  return "ASSIGN_TO_ME";
};

export const getMenuKeyFromPath = (
  pathname: string,
  search: string,
  navData: WorkflowNode[],
  menuConfig: MenuGroupConfig[]
): string => {
  const normalized = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  // Step 1: Exact match — return the menu key when the current pathname
  // exactly equals a menu item's route.
  // e.g. /flowzero/workflow-management → key "WorkflowManagment"
  for (const group of menuConfig) {
    for (const item of group.items) {
      if (item.route && normalized === item.route) return item.key;
    }
  }

  // Step 2: Special handling for assign-to-me —
  // Both /flowzero/assign-to-me and its child route /flowzero/assign-to-me/detail
  // need to derive a dynamic menu key from the URL query params
  // (workflowName / taskName / taskKey) to highlight the correct dynamic sidebar item.
  if (normalized.startsWith(`${BASE_PATH}/assign-to-me`)) {
    return resolveAssignToDoKey(search, navData);
  }

  // Step 3: Parent-child route prefix match —
  // When routes are defined as nested children (e.g. /flowzero/workflow-management/NewWorkflow),
  // the child page should highlight its parent menu item.
  // This is achieved by checking whether the current pathname starts with `route + "/"`.
  // e.g. /flowzero/workflow-management/NewWorkflow → highlights "WorkflowManagment"
  for (const group of menuConfig) {
    for (const item of group.items) {
      if (item.route && normalized.startsWith(item.route + "/"))
        return item.key;
    }
  }

  // No match found — return empty string so no sidebar item is highlighted
  return "";
};
