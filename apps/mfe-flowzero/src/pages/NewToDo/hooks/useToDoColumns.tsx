import type {
  CellClassParams,
  ColDef,
  ICellRendererParams,
  IHeaderParams,
  IRowNode,
  ValueGetterParams,
} from "ag-grid-community";
import { Checkbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import React, { useEffect, useMemo, useState } from "react";
import { getUserSettings } from "src/api/todo/Todo";
import EllipsisTooltip from "src/components/EllipsisTooltip";
import { Time } from "src/Root/import";
import type { ColumnSetting, TodoItem } from "src/types/todo";
import { formatWithThousandSeparators } from "src/util/common";

import OwnerCellRenderer from "../cellRenderers/OwnerCellRenderer";
import { VIEW_TYPE, type ViewType } from "../constants/index";

// ─── types ──────────────────────────────────────────────────────────────────

export interface ColSetupDef {
  key: string;
  label: string;
  colDef: ColDef;
}

type DynamicColMeta = Record<
  string,
  {
    label: string;
    dataType?: string;
    options?: Array<{ value: string; label: string }>;
  }
>;

// ─── helpers ────────────────────────────────────────────────────────────────

const toCamelCaseKey = (label: string): string => {
  const parts = label
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean);
  if (!parts.length) return label;
  return [
    parts[0].charAt(0).toLowerCase() + parts[0].slice(1),
    ...parts.slice(1).map((p) => p.charAt(0).toUpperCase() + p.slice(1)),
  ].join("");
};

const resolveVariableValue = (
  variables: Record<string, unknown> | null | undefined,
  key: string,
  label?: string
): unknown => {
  if (!variables) return undefined;
  if (Object.prototype.hasOwnProperty.call(variables, key)) {
    return variables[key];
  }
  if (label) {
    const camelKey = toCamelCaseKey(label);
    if (Object.prototype.hasOwnProperty.call(variables, camelKey)) {
      return variables[camelKey];
    }
  }
  return undefined;
};

/** Resolves a raw value (single multi-select or checkbox) to its display label(s) using the option list. */
const resolveLabel = (
  raw: unknown,
  options?: Array<{ value: string; label: string }>
): unknown => {
  if (!options?.length || raw == null || raw === "") return raw;
  const values: string[] = Array.isArray(raw)
    ? raw.map(String)
    : (() => {
        try {
          const parsed = JSON.parse(String(raw));
          return Array.isArray(parsed) ? parsed.map(String) : [String(raw)];
        } catch {
          return [String(raw)];
        }
      })();
  return values
    .map((v) => options.find((m) => m.value === v)?.label ?? v)
    .join(", ");
};

const toDisplayValue = (value: unknown, dataType?: string): React.ReactNode => {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  )
    return "--";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "object") return JSON.stringify(value);
  if (dataType === "NUMBER") {
    const num = Number(value);
    if (!isNaN(num)) return formatWithThousandSeparators(num);
  }
  return value as React.ReactNode;
};

export const canShowAssignAction = (data: TodoItem): boolean => {
  if (!data) return false;
  if (data.assignee) return false;
  return !data.candidateUser || !data.candidateGroup;
};

// ─── SelectAllHeader ─────────────────────────────────────────────────────────

/** Custom header checkbox for ag-grid infinite row model. */
export const SelectAllHeader: React.FC<IHeaderParams> = ({ api }) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!api) return;
    const computeChecked = () => {
      try {
        const currentPage = api.paginationGetCurrentPage();
        const pageSize = api.paginationGetPageSize();
        const startRow = currentPage * pageSize;
        const endRow = startRow + pageSize - 1;
        let allSelected = true;
        let anyRow = false;
        api.forEachNode((node: IRowNode) => {
          if (
            node.rowIndex != null &&
            node.rowIndex >= startRow &&
            node.rowIndex <= endRow
          ) {
            anyRow = true;
            if (!node.isSelected()) allSelected = false;
          }
        });
        setChecked(allSelected && anyRow);
      } catch {
        setChecked(false);
      }
    };
    api.addEventListener("modelUpdated", computeChecked);
    api.addEventListener("selectionChanged", computeChecked);
    return () => {
      api.removeEventListener("modelUpdated", computeChecked);
      api.removeEventListener("selectionChanged", computeChecked);
    };
  }, [api]);

  const handleChange = (e: CheckboxChangeEvent) => {
    const next = e.target.checked;
    setChecked(next);
    if (next) {
      const currentPage = api.paginationGetCurrentPage();
      const pageSize = api.paginationGetPageSize();
      const startRow = currentPage * pageSize;
      const endRow = startRow + pageSize - 1;
      api.forEachNode((node: IRowNode) => {
        if (
          node.rowIndex != null &&
          node.rowIndex >= startRow &&
          node.rowIndex <= endRow
        ) {
          node.setSelected(true);
        }
      });
    } else {
      api.deselectAll();
    }
  };

  return <Checkbox checked={checked} onChange={handleChange} />;
};

// ─── ALL_COL_SETUP ───────────────────────────────────────────────────────────

export const ALL_COL_SETUP: ColSetupDef[] = [
  {
    key: "requestId",
    label: "Request ID",
    colDef: {
      headerName: "Request ID",
      field: "requestId",
      minWidth: 180,
      flex: 1,
      cellRenderer: (params: ICellRendererParams) =>
        params.data == null ? null : (
          <EllipsisTooltip value={params.value ?? "--"} />
        ),
    },
  },
  {
    key: "assignee",
    label: "Assignee",
    colDef: {
      headerName: "Assignee",
      field: "assignee",
      minWidth: 200,
      flex: 1,
      cellRenderer: (params: ICellRendererParams) =>
        params.data == null ? null : params.value ? (
          <OwnerCellRenderer {...(params as unknown as CellClassParams)} />
        ) : (
          <span>--</span>
        ),
    },
  },
  {
    key: "workflowName",
    label: "Workflow Name",
    colDef: {
      headerName: "Workflow Name",
      field: "workflowName",
      flex: 1,
      minWidth: 200,
      cellRenderer: (params: ICellRendererParams) =>
        params.data == null ? null : (
          <EllipsisTooltip value={params.value ?? "--"} />
        ),
    },
  },
  {
    key: "taskName",
    label: "Task Name",
    colDef: {
      headerName: "Task Name",
      field: "taskName",
      flex: 1,
      minWidth: 160,
      cellRenderer: (params: ICellRendererParams) =>
        params.data == null ? null : (
          <EllipsisTooltip value={params.value ?? "--"} />
        ),
    },
  },
  {
    key: "taskId",
    label: "Task ID",
    colDef: {
      headerName: "Task ID",
      field: "taskId",
      minWidth: 160,
      flex: 1,
      cellRenderer: (params: ICellRendererParams) =>
        params.data == null ? null : (
          <EllipsisTooltip value={params.value ?? "--"} />
        ),
    },
  },
  {
    key: "createdBy",
    label: "Created By",
    colDef: {
      headerName: "Created By",
      field: "createdBy",
      minWidth: 200,
      flex: 1,
      cellRenderer: (params: ICellRendererParams) =>
        params.data == null ? null : params.value ? (
          <OwnerCellRenderer {...(params as unknown as CellClassParams)} />
        ) : (
          <span>--</span>
        ),
    },
  },
  {
    key: "lastUpdatedBy",
    label: "Last Updated By",
    colDef: {
      headerName: "Last Updated By",
      field: "lastUpdatedBy",
      minWidth: 200,
      flex: 1,
      cellRenderer: (params: ICellRendererParams) =>
        params.data == null ? null : params.value ? (
          <OwnerCellRenderer {...(params as unknown as CellClassParams)} />
        ) : (
          <span>--</span>
        ),
    },
  },
  {
    key: "candidateUser",
    label: "Candidate User",
    colDef: {
      headerName: "Candidate User",
      field: "candidateUser",
      flex: 1,
      minWidth: 200,
      cellRenderer: (params: ICellRendererParams) =>
        params.data == null ? null : params.value ? (
          <OwnerCellRenderer {...(params as unknown as CellClassParams)} />
        ) : (
          <span>--</span>
        ),
    },
  },
  {
    key: "candidateGroup",
    label: "Candidate Group",
    colDef: {
      headerName: "Candidate Group",
      field: "candidateGroup",
      flex: 1,
      minWidth: 200,
      cellRenderer: (params: ICellRendererParams) =>
        params.data == null ? null : (
          <EllipsisTooltip value={params.value ?? "--"} />
        ),
    },
  },
  {
    key: "createTime",
    label: "Create Time",
    colDef: {
      headerName: "Create Time",
      field: "createTime",
      flex: 1,
      cellRenderer: (params: ICellRendererParams) =>
        params.data == null ? null : params.value ? (
          <Time value={params.value} />
        ) : (
          <span>--</span>
        ),
      minWidth: 250,
    },
  },
  {
    key: "updateTime",
    label: "Update Time",
    colDef: {
      headerName: "Update Time",
      field: "updateTime",
      flex: 1,
      cellRenderer: (params: ICellRendererParams) =>
        params.data == null ? null : params.value ? (
          <Time value={params.value} />
        ) : (
          <span>--</span>
        ),
      minWidth: 250,
    },
  },
];

// ─── hook ────────────────────────────────────────────────────────────────────

interface UseToDoColumnsParams {
  urlTaskName: string | undefined;
  urlWorkflowName: string;
  viewType: ViewType;
  defaultColKeys: string[];
  handleClaimRef: React.MutableRefObject<(rows: TodoItem[]) => void>;
  handleAssignOpenRef: React.MutableRefObject<(rows: TodoItem[]) => void>;
}

export const useToDoColumns = ({
  urlTaskName,
  urlWorkflowName,
  viewType,
  defaultColKeys,
  handleClaimRef,
  handleAssignOpenRef,
}: UseToDoColumnsParams) => {
  const [activeColKeys, setActiveColKeys] = useState<string[]>(
    () => defaultColKeys
  );
  const [dynamicCol, setDynamicCol] = useState<DynamicColMeta>({});

  // Load saved column settings on mount
  useEffect(() => {
    const settingsKey = urlTaskName
      ? `${urlWorkflowName}--${urlTaskName}`
      : urlWorkflowName || "ASSIGNED_TO_ME";
    getUserSettings("TODO_COLUMNS", settingsKey)
      .then((res) => {
        const columns = res?.settings?.columns as ColumnSetting[] | undefined;
        if (Array.isArray(columns) && columns.length > 0) {
          const meta: DynamicColMeta = {};
          const visibleCols: ColumnSetting[] = [];
          columns.forEach((c) => {
            meta[c.fieldId] = {
              label: c.label,
              ...(c.dataType && { dataType: c.dataType }),
              ...(c.options?.length && { options: c.options }),
            };
            if (c.visible) visibleCols.push(c);
          });
          const visibleKeys = visibleCols
            .sort((a, b) => a.order - b.order)
            .map((c) => c.fieldId);
          setDynamicCol(meta);
          if (visibleKeys.length > 0) setActiveColKeys(visibleKeys);
        } else {
          setActiveColKeys(defaultColKeys);
        }
      })
      .catch(() => {
        setActiveColKeys(defaultColKeys);
      });
  }, [urlTaskName, urlWorkflowName, defaultColKeys]);

  const checkboxColumn = useMemo<ColDef>(
    () => ({
      headerComponent: SelectAllHeader,
      checkboxSelection: true,
      width: 52,
      minWidth: 52,
      maxWidth: 52,
      resizable: false,
      suppressMovable: true,
      suppressHeaderMenuButton: true,
    }),
    []
  );

  const computedColumns = useMemo(() => {
    const cols = activeColKeys
      .map((key) => {
        const system = ALL_COL_SETUP.find((d) => d.key === key);
        if (system) return system.colDef;
        const headerName = dynamicCol[key]?.label ?? key;
        const metaOptions = dynamicCol[key]?.options;
        return {
          headerName,
          valueGetter: (params: ValueGetterParams<TodoItem>) =>
            resolveLabel(
              resolveVariableValue(params.data?.variables, key, headerName),
              metaOptions
            ),
          cellRenderer: (params: ICellRendererParams) => {
            if (params.data == null) return null;
            const rawValue = resolveVariableValue(
              params.data?.variables,
              key,
              headerName
            );
            return (
              <EllipsisTooltip
                value={toDisplayValue(
                  resolveLabel(rawValue, metaOptions),
                  dynamicCol[key]?.dataType
                )}
              />
            );
          },
          flex: 1,
          minWidth: 160,
        } as ColDef;
      })
      .filter(Boolean) as ColDef[];

    if (viewType !== VIEW_TYPE.ASSIGNED_TO_ME) {
      cols.unshift(checkboxColumn);
      cols.push({
        headerName: "Actions",
        field: "action",
        width: 160,
        pinned: "right",
        sortable: false,
        resizable: false,
        suppressHeaderMenuButton: true,
        cellRenderer: (params: ICellRendererParams) => (
          <div className="flex items-center gap-3 h-full">
            {canShowAssignAction(params.data) && (
              <button
                className="text-[#0473EA] cursor-pointer bg-transparent border-none p-0 hover:opacity-70"
                onClick={(e) => {
                  e.stopPropagation();
                  if (params.data?.candidateUser) {
                    handleClaimRef.current([params.data]);
                  } else {
                    handleAssignOpenRef.current([params.data]);
                  }
                }}
              >
                Assign
              </button>
            )}
          </div>
        ),
      } as ColDef);
    }
    return cols;
  }, [activeColKeys, checkboxColumn, dynamicCol, viewType]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    activeColKeys,
    setActiveColKeys,
    dynamicCol,
    setDynamicCol,
    computedColumns,
  };
};
