import {
  Cell,
  Column,
  OnChangeFn,
  Row,
  RowData,
  Table,
  TableFeature,
  Updater,
  makeStateUpdater,
} from '@tanstack/lit-table';
import { memo } from '../../../shared/memo.js';

export type OrderedRowIdViaDragging = string[];
export type OrderedDraggableRows = Row<any>[];

export interface RowDraggableTableState {
  orderedRowIdViaDragging: OrderedRowIdViaDragging;
  /**
   * used only when dragging
   */
  orderedDraggableRows: OrderedDraggableRows;
}

export interface RowDraggableOptions {
  onOrderedRowIdViaDraggingChange?: OnChangeFn<OrderedRowIdViaDragging>;
  onOrderedDraggableRowsChange?: OnChangeFn<OrderedDraggableRows>;
  enableDraggableRow?: boolean;
}

export interface RowDraggableInstance {
  setOrderedRowIdViaDragging: (
    updater: Updater<OrderedRowIdViaDragging>
  ) => void;
  setOrderedDraggableRows: (updater: Updater<OrderedDraggableRows>) => void;
  getIsEnableDraggableRow: () => boolean;
}

export interface RowDraggableColumn<TData extends RowData> {
  getIsDraggable: () => boolean;
}

export interface RowDraggableRow {
  getIsDraggable: () => boolean;
}
export interface RowDraggableCell<TData extends RowData> {
    rowDraggableCellPlaceholder?: boolean;
}

export const RowDraggableFeature: TableFeature<any> = {
  getInitialState: (state): RowDraggableTableState => {
    return {
      orderedRowIdViaDragging: [],
      orderedDraggableRows: [],
      ...state,
    };
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): RowDraggableOptions => {
    return {
      onOrderedRowIdViaDraggingChange: makeStateUpdater(
        'orderedRowIdViaDragging',
        table
      ),
      onOrderedDraggableRowsChange: makeStateUpdater(
        'orderedDraggableRows',
        table
      ),
    } as RowDraggableOptions;
  },
  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setOrderedRowIdViaDragging = updater =>
      table.options.onOrderedRowIdViaDraggingChange?.(updater);
    table.setOrderedDraggableRows = updater =>
      table.options.onOrderedDraggableRowsChange?.(updater);

    table.getIsEnableDraggableRow = memo(
      () => [table.getState(), table.options],
      (tableState, tableOptions) => {
        // also will ignore pinned top/bottom rows
        const sorted = tableState.sorting.length > 0;
        const filtered = tableState.columnFilters.length > 0;
        const globalSorted = tableState.globalFilter;
        const grouped = tableState.grouping.length > 0;
        const isEnablePagination = tableOptions.isEnablePagination;
        const isManual = tableOptions.manualFiltering || tableOptions.manualSorting;
        if (
          isManual ||
          isEnablePagination ||
          sorted ||
          filtered ||
          globalSorted ||
          grouped
        ) {
          return false;
        }

        return Boolean(tableOptions.enableDraggableRow);
      }
    );
  },
  createColumn: <TData extends RowData, TValue>(
    column: Column<TData, TValue>,
    table: Table<TData>
  ): void => {
    column.getIsDraggable = () => {
      if (!table.options.enableDraggableRow) {
        return false;
      }
      return column.columnDef.meta?.draggable ?? false;
    };
  },
  createCell: <TData extends RowData, TValue>(
    cell: Cell<TData, TValue>,
    column: Column<TData, TValue>,
    row: Row<TData>,
    table: Table<TData>
  ): void => {},
  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>
  ): void => {
    row.getIsDraggable = memo(
      () => [
        table.getState().rowPinning.top,
        table.getState().rowPinning.bottom,
      ],
      (top, bottom) => {
        const pinnedRowIds = new Set([...(top ?? []), ...(bottom ?? [])]);
        return !pinnedRowIds.has(row.id);
      }
    );
  },
};
