import { Cell, Column, Row, RowData, Table } from '@tanstack/lit-table';

export interface ColumnSpanningDef<TData extends RowData, TValue> {
  colSpanning?:
    | number
    | ((
        table: Table<TData>,
        column: Column<TData>,
        row: Row<TData>,
        cell: Cell<TData, TValue>
      ) => number);
}
