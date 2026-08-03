import { Cell, RowData } from '@tanstack/lit-table';

export interface RowSpanningDef<TData extends RowData, TValue> {
  rowSpanning?:
    | boolean
    | ((
        cell: Cell<unknown, unknown>,
        nextCell: Cell<unknown, unknown>
      ) => boolean);
}
