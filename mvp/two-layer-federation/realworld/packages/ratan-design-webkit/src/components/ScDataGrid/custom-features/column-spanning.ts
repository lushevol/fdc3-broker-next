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
import { ColumnSpanningDef } from '../types/features/ColumnSpanningDef.js';

// col spanning and row spanning base on col order or row order.
// so need to re-calculate when col order or row roder updated

/**
 * cellId: some column id which need combine them all
 */
export type ColumnSpanningConfigurationsState = Map<
  string,
  ColumnSpanningDef<any, unknown>['colSpanning']
>;

export type ColumnSpanningState = Map<string, Set<Cell<any, unknown>>>;

export interface ColumnSpanningTableState {
  columnSpanningConfigurations: ColumnSpanningConfigurationsState;
  columnSpanning: ColumnSpanningState;
}

export interface ColumnSpanningOptions {
  onColumnSpanningConfigurationsChange?: OnChangeFn<ColumnSpanningConfigurationsState>;
  onColumnSpanningChange?: OnChangeFn<ColumnSpanningState>;
}

export interface ColumnSpanningInstance {
  setColumnSpanningConfigurations: (
    updater: Updater<ColumnSpanningConfigurationsState>
  ) => void;
  setColumnSpanning: (updater: Updater<ColumnSpanningState>) => void;
}

export interface ColumnSpanningColumn<TData extends RowData> {
  getColumnsByPinning: (colId?: string) => Column<TData, unknown>[];
}
export interface ColumnSpanningCell<TData extends RowData> {
  getSpannedColumns: () => Column<TData, unknown>[];
  getIsColSpanningRoot: () => boolean;
}

export const ColumnSpanningFeature: TableFeature<any> = {
  getInitialState: (state): ColumnSpanningTableState => {
    return {
      columnSpanningConfigurations: new Map(),
      columnSpanning: new Map(),
      ...state,
    };
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): ColumnSpanningOptions => {
    return {
      onColumnSpanningConfigurationsChange: makeStateUpdater(
        'columnSpanningConfigurations',
        table
      ),
    } as ColumnSpanningOptions;
  },
  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setColumnSpanningConfigurations = updater =>
      table.options.onColumnSpanningConfigurationsChange?.(updater);
  },
  createColumn: <TData extends RowData, TValue>(
    column: Column<TData, TValue>,
    table: Table<TData>
  ): void => {
    column.getColumnsByPinning = memo(
      colId => [
        colId,
        table.getCenterVisibleLeafColumns(),
        table.getLeftVisibleLeafColumns(),
        table.getRightVisibleLeafColumns(),
      ],
      (
        colId,
        centerVisibleColumns,
        leftVisibleColumns,
        rightVisibleColumns
      ) => {
        const currentColumn = colId ? table.getColumn(colId) : column;
        if (!currentColumn) {
          return [];
        }

        const isPinned = currentColumn.getIsPinned();
        let columns = centerVisibleColumns;
        if (isPinned === 'left') {
          columns = leftVisibleColumns;
        } else if (isPinned === 'right') {
          columns = rightVisibleColumns;
        }
        return columns;
      }
    );
  },
  createCell: <TData extends RowData, TValue>(
    cell: Cell<TData, TValue>,
    column: Column<TData, TValue>,
    row: Row<TData>,
    table: Table<TData>
  ): void => {
    cell.getIsColSpanningRoot = memo(
      () => [cell.getSpannedColumns()],
      colSpanningState => {
        return colSpanningState.length > 0;
      }
    );
    cell.getSpannedColumns = memo(
      () => [
        cell,
        column,
        row,
        table,
        table.getState().columnSpanningConfigurations,
        table.getState().columnVisibility,
      ],
      () => {
        let spanNumber = 1;
        const spanningCon = table.getState().columnSpanningConfigurations;
        const colSpan = spanningCon.get(column.id);

        if (colSpan) {
          spanNumber =
            colSpan instanceof Function
              ? colSpan(table, column, row, cell)
              : colSpan;
        }
        if (spanNumber < 2) {
          return [];
        }

        const nextColumns = column.getNextColumns(spanNumber - 1);

        return nextColumns;
      }
    );
  },
};
