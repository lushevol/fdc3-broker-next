import { SortingFnOption } from '@tanstack/lit-table';

// ascending -> descending -> none
export type SortDirection = 'asc' | 'desc' | 'none';
export interface RowSortingDef<TData> {
  sort?: SortDirection;
  sortable?: boolean;
  sortingOrder?: SortDirection[];
  comparator?: SortingFnOption<TData>
}
