import { Cell, Row, RowData } from '@tanstack/lit-table';

// getContext -> below
// cell: Cell<TData, TValue>
// column: Column<TData, TValue>
// getValue: Getter<TValue>
// renderValue: Getter<TValue | null>
// row: Row<TData>
// table: Table<TData>
export interface GroupingColumnDef<TData extends RowData, TValue> {
  rowGrouping?: boolean;
  aggregatedCell?:
    | string
    | ((props: ReturnType<Cell<TData, TValue>['getContext']>) => any);
  getGroupingTreePath?: (originalRow: TData, index: number) => string[];
  rowGroupingTree?: boolean;
}
