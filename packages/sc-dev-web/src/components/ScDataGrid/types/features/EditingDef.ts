import { Cell, CellContext, RowData } from '@tanstack/lit-table';

export type TCellEditorParams = (
  props: CellContext<unknown, unknown>
) => any;
export type TCellEditor = (
  props: CellContext<unknown, unknown>,
  params: any,
  sendValue: (updatedVal: any) => void
) => any;

export interface EditingDef<TData extends RowData, TValue> {
  editable?: boolean | ((cell: Cell<TData, TValue>) => boolean);
  cellEditorParams?: TCellEditorParams;
  cellEditor?: TCellEditor;
}
