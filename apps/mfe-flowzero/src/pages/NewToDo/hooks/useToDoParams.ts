import { useEffect, useMemo, useState } from "react";
import { getWorkflowNavigation } from "src/api/todo/Todo";
import { ReactRouterDom } from "src/Root/import";

import {
  VIEW_TYPE,
  VIEW_TYPE_DEFAULT_COL_KEYS,
  type ViewType,
} from "../constants/index";

const { useLocation } = ReactRouterDom;

export interface ToDoParams {
  urlParams: URLSearchParams;
  urlWorkflowName: string;
  urlTaskName: string | undefined;
  urlAssigneeOnly: true | undefined;
  urlWorkflowIds: string[] | undefined;
  urlWorkflowIdsKey: string;
  viewType: ViewType;
  defaultColKeys: string[];
}

export const useToDoParams = (): ToDoParams => {
  const location = useLocation();
  const urlParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const urlWorkflowName = urlParams.get("workflowName") ?? "";
  const urlTaskName = urlParams.get("taskName") ?? undefined;
  const urlAssigneeOnly =
    urlParams.get("assigneeOnly") === "true" ? (true as const) : undefined;

  const urlWorkflowIdsFromUrl = useMemo(() => {
    const raw = urlParams.get("workflowIds");
    if (!raw) return undefined;
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0
        ? (parsed as string[])
        : undefined;
    } catch {
      return undefined;
    }
  }, [urlParams]);

  const [urlWorkflowIds, setUrlWorkflowIds] = useState<string[] | undefined>(
    urlWorkflowIdsFromUrl
  );

  useEffect(() => {
    if (urlWorkflowIdsFromUrl) {
      setUrlWorkflowIds(urlWorkflowIdsFromUrl);
      return;
    }
    if (!urlWorkflowName) {
      setUrlWorkflowIds(undefined);
      return;
    }
    getWorkflowNavigation()
      .then((res) => {
        const match = res.find((w) => w.workflowName === urlWorkflowName);
        setUrlWorkflowIds(
          match?.workflowIds?.length ? match.workflowIds : undefined
        );
      })
      .catch(() => {
        setUrlWorkflowIds(undefined);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlWorkflowName, urlParams.get("workflowIds")]);

  const urlWorkflowIdsKey = urlWorkflowIds?.join(",") ?? "";

  const viewType = useMemo((): ViewType => {
    if (urlAssigneeOnly === true) return VIEW_TYPE.ASSIGNED_TO_ME;
    if (urlTaskName) return VIEW_TYPE.TASK;
    return VIEW_TYPE.WORKFLOW;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlWorkflowName, urlTaskName, urlAssigneeOnly]);

  const defaultColKeys = useMemo(
    () => [...VIEW_TYPE_DEFAULT_COL_KEYS[viewType]],
    [viewType]
  );

  return {
    urlParams,
    urlWorkflowName,
    urlTaskName,
    urlAssigneeOnly,
    urlWorkflowIds,
    urlWorkflowIdsKey,
    viewType,
    defaultColKeys,
  };
};
