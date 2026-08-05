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

// key -> row id, value -> row height<number>
export type RowHeightState = Record<string, number | undefined | null>;

export type RowMaxHeightState = Record<string, number | undefined | null>;
export type RowMinHeightState = Record<string, number | undefined | null>;

export interface RowHeightTableState {
  rowHeight: RowHeightState;
  rowMaxHeight: RowMaxHeightState;
  rowMinHeight: RowMinHeightState;
}

export interface RowHeightOptions {
  onRowHeightChange?: OnChangeFn<RowHeightState>;
  onRowMaxHeightChange?: OnChangeFn<RowMaxHeightState>;
  onRowMinHeightChange?: OnChangeFn<RowMinHeightState>;
}

export interface RowHeightInstance {
  setRowHeight: (updater: Updater<RowHeightState>) => void;
  setRowMaxHeight: (updater: Updater<RowMaxHeightState>) => void;
  setRowMinHeight: (updater: Updater<RowMinHeightState>) => void;
  resetRowHeight: (defaultState?: RowHeightState) => void;
  resetRowMaxHeight: (defaultState?: RowMaxHeightState) => void;
  resetRowMinHeight: (defaultState?: RowMinHeightState) => void;
}

export interface RowHeightColumn<TData extends RowData> {rhp?: boolean;}

export interface RowHeightRow {
  getHeight: () => number | undefined | null;
  getMaxHeight: () => number | undefined | null;
  getMinHeight: () => number | undefined | null;
}
export interface RowHeightCell<TData extends RowData> {rhp?: boolean;}

export const RowHeightFeature: TableFeature<any> = {
  getInitialState: (state): RowHeightTableState => {
    return {
      rowHeight: {},
      rowMaxHeight: {},
      rowMinHeight: {},
      ...state,
    };
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): RowHeightOptions => {
    return {
      onRowHeightChange: makeStateUpdater('rowHeight', table),
      onRowMaxHeightChange: makeStateUpdater('rowMaxHeight', table),
      onRowMinHeightChange: makeStateUpdater('rowMinHeight', table),
    } as RowHeightOptions;
  },
  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setRowHeight = updater => table.options.onRowHeightChange?.(updater);
    table.setRowMaxHeight = updater =>
      table.options.onRowMaxHeightChange?.(updater);
    table.setRowMinHeight = updater =>
      table.options.onRowMinHeightChange?.(updater);

    table.resetRowHeight = defaultState => {
      table.setRowHeight(defaultState ?? {});
    };
    table.resetRowMaxHeight = defaultState => {
      table.setRowMaxHeight(defaultState ?? {});
    };
    table.resetRowMinHeight = defaultState => {
      table.setRowMinHeight(defaultState ?? {});
    };
  },
  createColumn: <TData extends RowData, TValue>(
    column: Column<TData, TValue>,
    table: Table<TData>
  ): void => {},
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
    row.getHeight = memo(
      () => [table.getState().rowHeight],
      rowHeight => {
        return rowHeight[row.id];
      }
    );
    row.getMaxHeight = memo(
      () => [table.getState().rowMaxHeight],
      rowHeight => {
        return rowHeight[row.id];
      }
    );
    row.getMinHeight = memo(
      () => [table.getState().rowMinHeight],
      rowHeight => {
        return rowHeight[row.id];
      }
    );
  },
};
