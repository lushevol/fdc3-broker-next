import { useMemo, type ReactNode } from 'react';
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  type CellKeyDownEvent,
  type ColDef,
  type RowClickedEvent,
  type RowDoubleClickedEvent,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './styles.css';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export interface RatanDataGridColumn<Row extends object> {
  readonly key: Extract<keyof Row, string>;
  readonly header: string;
  readonly width?: number;
  readonly minWidth?: number;
  readonly flex?: number;
  readonly sortable?: boolean;
  readonly formatValue?: (value: unknown, row: Row) => string;
  readonly renderCell?: (row: Row) => ReactNode;
}

export interface RatanDataGridProps<Row extends object> {
  readonly ariaLabel: string;
  readonly rows: readonly Row[];
  readonly columns: readonly RatanDataGridColumn<Row>[];
  readonly getRowId: (row: Row) => string;
  readonly selectedRowId?: string | null;
  readonly onSelectionChange?: (row: Row) => void;
  readonly onActivate?: (row: Row) => void;
  readonly pageSize?: number;
  readonly loading?: boolean;
  readonly error?: string | null;
  readonly onRetry?: () => void;
  readonly emptyMessage?: string;
}

export function createColumnDefinitions<Row extends object>(
  columns: readonly RatanDataGridColumn<Row>[],
): ColDef<Row>[] {
  return columns.map((column) => ({
    colId: column.key,
    field: column.key as unknown as ColDef<Row>['field'],
    headerName: column.header,
    width: column.width,
    minWidth: column.minWidth,
    flex: column.flex,
    sortable: column.sortable ?? true,
    valueFormatter: column.formatValue
      ? ({ value, data }) => data ? column.formatValue?.(value, data) ?? '' : ''
      : undefined,
    cellRenderer: column.renderCell
      ? ({ data }: { data?: Row }) => data ? column.renderCell?.(data) : null
      : undefined,
  }));
}

export function RatanDataGrid<Row extends object>({
  ariaLabel,
  rows,
  columns,
  getRowId,
  selectedRowId = null,
  onSelectionChange,
  onActivate,
  pageSize = 10,
  loading = false,
  error = null,
  onRetry,
  emptyMessage = 'No records found.',
}: RatanDataGridProps<Row>) {
  const columnDefs = useMemo(() => createColumnDefinitions(columns), [columns]);
  if (loading) return <div className="ratan-data-grid-state" role="status">Loading {ariaLabel}…</div>;
  if (error) return <div className="ratan-data-grid-state ratan-data-grid-error" role="alert"><p>{error}</p>{onRetry ? <button type="button" onClick={onRetry}>Retry {ariaLabel}</button> : null}</div>;
  if (rows.length === 0) return <div className="ratan-data-grid-state" role="status">{emptyMessage}</div>;

  const activate = (row?: Row) => { if (row) onActivate?.(row); };
  return (
    <div className="ratan-data-grid ag-theme-quartz" role="region" aria-label={ariaLabel}>
      <AgGridReact<Row>
        rowData={[...rows]}
        columnDefs={columnDefs}
        getRowId={({ data }) => getRowId(data)}
        pagination
        paginationPageSize={pageSize}
        paginationPageSizeSelector={false}
        rowSelection="single"
        domLayout="autoHeight"
        getRowClass={({ data }) => data && getRowId(data) === selectedRowId ? 'ratan-row-selected' : undefined}
        onRowClicked={(event: RowClickedEvent<Row>) => { if (event.data) onSelectionChange?.(event.data); }}
        onRowDoubleClicked={(event: RowDoubleClickedEvent<Row>) => activate(event.data)}
        onCellKeyDown={(event: CellKeyDownEvent<Row>) => {
          if ((event.event as KeyboardEvent | undefined)?.key === 'Enter') activate(event.data);
        }}
        defaultColDef={{ resizable: true }}
        suppressCellFocus={false}
      />
    </div>
  );
}
