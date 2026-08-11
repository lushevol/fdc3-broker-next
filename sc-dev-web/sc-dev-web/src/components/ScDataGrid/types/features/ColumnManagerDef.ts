import { Column, Table } from '@tanstack/lit-table';

type TLabelParas<TData, TValue> = {
  table: Table<TData>;
  column: Column<TData, TValue>;
};

export interface ColumnManagerDef<TData, TValue> {
  columnManagerLabel?: string | ((props: TLabelParas<TData, TValue>) => string);
  hide?: boolean;
  lock?: 'ordering' | 'visibility' | boolean;
}
