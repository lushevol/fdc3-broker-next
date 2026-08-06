import {
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { AriaButtonAdapter } from '@fm/ratan-design-foundation';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type Updater,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

export interface DataGridSortingItem {
  readonly id: string;
  readonly descending: boolean;
}
export type DataGridSorting = readonly DataGridSortingItem[];
export type DataGridSelectionMode = 'none' | 'single' | 'multiple';

export interface DataGridChangeDetail {
  readonly reason: 'sort' | 'selection';
  readonly rowId?: string;
}

export interface DataGridCellContext<Row, Value = unknown> {
  readonly row: Row;
  readonly rowIndex: number;
  readonly value: Value;
  readonly columnId: string;
}

export interface DataGridColumn<Row, Value = unknown> {
  readonly id: string;
  readonly header: ReactNode;
  readonly accessor: keyof Row | ((row: Row) => Value);
  readonly cell?: (context: DataGridCellContext<Row, Value>) => ReactNode;
  readonly sortable?: boolean;
  readonly width?: number;
}

export interface DataGridProps<Row> {
  readonly data: readonly Row[];
  readonly columns: readonly DataGridColumn<Row, unknown>[];
  readonly getRowId?: (row: Row, index: number) => string;
  readonly sorting?: DataGridSorting;
  readonly defaultSorting?: DataGridSorting;
  readonly onSortingChange?: (sorting: DataGridSorting, detail: DataGridChangeDetail) => void;
  readonly manualSorting?: boolean;
  readonly selection?: readonly string[];
  readonly defaultSelection?: readonly string[];
  readonly onSelectionChange?: (selection: readonly string[], detail: DataGridChangeDetail) => void;
  readonly selectionMode?: DataGridSelectionMode;
  readonly loading?: boolean;
  readonly refreshing?: boolean;
  readonly error?: unknown;
  readonly loadingState?: ReactNode;
  readonly errorState?: ReactNode;
  readonly emptyState?: ReactNode;
  readonly height?: number;
  readonly rowHeight?: number;
  readonly overscan?: number;
  readonly className?: string;
  readonly dir?: 'ltr' | 'rtl';
  readonly lang?: string;
  readonly 'aria-label': string;
}

function toTanStackSorting(sorting: DataGridSorting): SortingState {
  return sorting.map(({ id, descending }) => ({ id, desc: descending }));
}

function fromTanStackSorting(sorting: SortingState): DataGridSorting {
  return sorting.map(({ id, desc }) => ({ id, descending: desc }));
}

export function DataGrid<Row>({
  data,
  columns,
  getRowId,
  sorting,
  defaultSorting = [],
  onSortingChange,
  manualSorting = false,
  selection,
  defaultSelection = [],
  onSelectionChange,
  selectionMode = 'none',
  loading = false,
  refreshing = false,
  error,
  loadingState = <span role="status">Loading</span>,
  errorState = <span role="alert">Unable to load data</span>,
  emptyState = <span>No data</span>,
  height = 320,
  rowHeight = 40,
  overscan = 4,
  className,
  dir,
  lang,
  'aria-label': ariaLabel,
}: DataGridProps<Row>) {
  const [internalSorting, setInternalSorting] = useState<DataGridSorting>(defaultSorting);
  const [internalSelection, setInternalSelection] = useState<readonly string[]>(defaultSelection);
  const resolvedSorting = sorting ?? internalSorting;
  const resolvedSelection = selection ?? internalSelection;
  const scrollRef = useRef<HTMLDivElement>(null);
  const tableData = useMemo(() => [...data], [data]);
  const tableSorting = useMemo(() => toTanStackSorting(resolvedSorting), [resolvedSorting]);

  const tableColumns = useMemo<ColumnDef<Row>[]>(
    () => columns.map((column) => {
      const accessor = column.accessor;
      return {
        id: column.id,
        header: () => column.header,
        accessorFn: typeof accessor === 'function'
          ? accessor
          : (row) => row[accessor],
        enableSorting: column.sortable ?? false,
        size: column.width,
        cell: (context) => column.cell
          ? column.cell({
            row: context.row.original,
            rowIndex: context.row.index,
            value: context.getValue(),
            columnId: column.id,
          })
          : String(context.getValue() ?? ''),
      };
    }),
    [columns],
  );

  const handleSortingChange = (updater: Updater<SortingState>) => {
    const current = toTanStackSorting(resolvedSorting);
    const next = typeof updater === 'function' ? updater(current) : updater;
    const publicSorting = fromTanStackSorting(next);
    if (sorting === undefined) setInternalSorting(publicSorting);
    onSortingChange?.(publicSorting, { reason: 'sort' });
  };

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    state: { sorting: tableSorting },
    onSortingChange: handleSortingChange,
    manualSorting,
    getRowId: getRowId ? (row, index) => getRowId(row, index) : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
  });
  const tableRows = table.getRowModel().rows;
  const virtualizer = useVirtualizer({
    count: tableRows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan,
    initialRect: { width: 800, height },
  });
  const virtualRows = virtualizer.getVirtualItems();
  const visibleRows = virtualRows.length > 0
    ? virtualRows
    : tableRows.slice(0, Math.ceil(height / rowHeight) + overscan).map((_, index) => ({
      index,
      key: index,
      start: index * rowHeight,
      size: rowHeight,
      end: (index + 1) * rowHeight,
      lane: 0,
    }));
  const gridTemplateColumns = `${selectionMode === 'none' ? '' : '2.5rem '}${table.getVisibleLeafColumns().map((column) => `${column.getSize()}px`).join(' ')}`;

  const toggleSelection = (rowId: string) => {
    const selected = resolvedSelection.includes(rowId);
    const next = selectionMode === 'single'
      ? (selected ? [] : [rowId])
      : (selected ? resolvedSelection.filter((id) => id !== rowId) : [...resolvedSelection, rowId]);
    if (selection === undefined) setInternalSelection(next);
    onSelectionChange?.(next, { reason: 'selection', rowId });
  };

  if (loading) return <div data-ratan-component="DataGridLoading">{loadingState}</div>;
  if (error) return <div data-ratan-component="DataGridError">{errorState}</div>;
  if (data.length === 0) return <div data-ratan-component="DataGridEmpty">{emptyState}</div>;

  return (
    <div
      ref={scrollRef}
      role="grid"
      aria-label={ariaLabel}
      aria-busy={refreshing || undefined}
      aria-rowcount={tableRows.length + 1}
      aria-colcount={columns.length + (selectionMode === 'none' ? 0 : 1)}
      className={className ? `ratan-data-grid ${className}` : 'ratan-data-grid'}
      data-ratan-component="DataGrid"
      dir={dir}
      lang={lang}
      style={{ '--ratan-data-grid-height': `${height}px` } as CSSProperties}
    >
      {refreshing ? <span role="status" className="ratan-data-grid__status">Refreshing</span> : null}
      <div role="row" className="ratan-data-grid__header" style={{ gridTemplateColumns }}>
        {selectionMode !== 'none' ? <div role="columnheader" aria-label="Selection" /> : null}
        {table.getHeaderGroups()[0]?.headers.map((header) => {
          const sorted = header.column.getIsSorted();
          return (
            <div key={header.id} role="columnheader" aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : 'none'}>
              {header.column.getCanSort() ? (
                <AriaButtonAdapter onPress={() => header.column.toggleSorting()} aria-label={`Sort by ${String(columns.find((column) => column.id === header.column.id)?.header ?? header.id)}`}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </AriaButtonAdapter>
              ) : flexRender(header.column.columnDef.header, header.getContext())}
            </div>
          );
        })}
      </div>
      <div role="rowgroup" className="ratan-data-grid__viewport" style={{ height: virtualizer.getTotalSize() }}>
        {visibleRows.map((virtualRow) => {
          const row = tableRows[virtualRow.index];
          if (!row) return null;
          const selected = resolvedSelection.includes(row.id);
          return (
            <div key={row.id} role="row" aria-rowindex={virtualRow.index + 2} aria-selected={selectionMode === 'none' ? undefined : selected} className="ratan-data-grid__row" style={{ gridTemplateColumns, height: virtualRow.size, transform: `translateY(${virtualRow.start}px)` }}>
              {selectionMode !== 'none' ? (
                <div role="gridcell">
                  <AriaButtonAdapter aria-label={`${selected ? 'Deselect' : 'Select'} row ${row.id}`} onPress={() => toggleSelection(row.id)}>{selected ? '✓' : ''}</AriaButtonAdapter>
                </div>
              ) : null}
              {row.getVisibleCells().map((cell) => <div key={cell.id} role="gridcell">{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
