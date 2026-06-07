import type { GridOptions, RowClassParams } from "ag-grid-community";

export const applyClientSort = (
  rows: any[],
  sortModel: { colId: string; sort: "asc" | "desc" }[]
): any[] => {
  if (!sortModel?.length) return rows;
  return [...rows].sort((a, b) => {
    for (const { colId, sort } of sortModel) {
      const av = a[colId] ?? "";
      const bv = b[colId] ?? "";
      if (av === bv) continue;
      const cmp = String(av).localeCompare(String(bv), undefined, {
        numeric: true,
        sensitivity: "base",
      });
      return sort === "asc" ? cmp : -cmp;
    }
    return 0;
  });
};

export const applyClientFilter = (
  rows: any[],
  filterModel: Record<string, any>
): any[] => {
  if (!filterModel || !Object.keys(filterModel).length) return rows;
  return rows.filter((row) =>
    Object.entries(filterModel).every(([field, model]: [string, any]) => {
      if (model.filterType === "set") {
        if (!model.values || model.values === null) return true;
        return (model.values as string[]).includes(String(row[field] ?? ""));
      }
      return true;
    })
  );
};

/**
 * Format a date/datetime value the same way the Time cellRenderer does.
 * LOCAL mode → "YYYY-MM-DD HH:mm:ss" (browser local time)
 * UTC   mode → "YYYY-MM-DDTHH:mm:ss+00:00"
 * Non-date values are returned as-is.
 */
export const formatTimeVal = (val: any, isLocal: boolean): string => {
  if (val === null || val === undefined || val === "" || val === "null")
    return "";
  const s = String(val);
  if (!/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(s)) return s;
  const d = new Date(s.replace(" ", "T"));
  if (isNaN(d.getTime())) return s;
  const p = (n: number) => String(n).padStart(2, "0");
  if (isLocal) {
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(
      d.getHours()
    )}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(
    d.getUTCDate()
  )}T${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(
    d.getUTCSeconds()
  )}+00:00`;
};

/** agSetColumnFilter match using the same formatted value as the Time renderer. */
export const applyLocalFilter = (
  rows: any[],
  filterModel: Record<string, any>,
  isLocal: boolean
): any[] => {
  if (!filterModel || !Object.keys(filterModel).length) return rows;
  return rows.filter((row) =>
    Object.entries(filterModel).every(([field, model]: [string, any]) => {
      if (model.filterType === "set") {
        if (!model.values || model.values === null) return true;
        const cellVal =
          formatTimeVal(row[field], isLocal) || String(row[field] ?? "");
        return (model.values as string[]).includes(cellVal);
      }
      return true;
    })
  );
};

export const createBaseGridOptions = (pageSize: number): GridOptions => ({
  pagination: true,
  paginationPageSize: pageSize,
  paginationPageSizeSelector: [5, 10, 20, 50, 100],
  rowHeight: 60,
  suppressPaginationPanel: false,
  rowModelType: "infinite" as const,
  cacheBlockSize: pageSize,
  maxBlocksInCache: 10, // Limit cache blocks to prevent excessive requests
  cacheOverflowSize: 2, // Number of blocks to keep in cache beyond visible area
  maxConcurrentDatasourceRequests: 1, //Limit concurrent requests to 1
  blockLoadDebounceMillis: 100, // Add debounce to prevent rapid requests
  infiniteInitialRowCount: pageSize, // Show loading rows equal to page size instead of just 1
  suppressMovableColumns: true,
  suppressContextMenu: true,
  headerHeight: 64,
  defaultColDef: {
    suppressHeaderMenuButton: true,
    suppressHeaderContextMenu: true,
    sortable: false,
  },
  getRowStyle: (params: RowClassParams) => {
    const idx = params.node.rowIndex ?? 0;
    return {
      background: idx % 2 === 0 ? "#ffffff" : "#F9F9F9",
    };
  },
});
