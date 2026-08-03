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
import { RowSpanningDef } from '../types/features/RowSpanningDef.js';

// Store finalize rowSpanning function
export type RowSpanningConfigurationsState = Map<
  string,
  RowSpanningDef<any, unknown>['rowSpanning']
>;

type RowSpanning = {
  rowIndex: number;
  cellId: string;
};
// cell id -> spanned row indexes
export type RowSpanningState = Map<string, Set<RowSpanning>>;

export interface RowSpanningTableState {
  // update together below two. then only trigger once re-render
  rowSpanningConfigurations: RowSpanningConfigurationsState;
  rowSpanning: RowSpanningState;
}

export interface RowSpanningOptions {
  onRowSpanningConfigurationsChange?: OnChangeFn<RowSpanningConfigurationsState>;
  onRowSpanningChange?: OnChangeFn<RowSpanningState>;
}

export interface RowSpanningInstance<TData> {
  setRowSpanningConfigurations: (
    updater: Updater<RowSpanningConfigurationsState>
  ) => void;
  setRowSpanning: (updater: Updater<RowSpanningState>) => void;
  getRowSpanConf: (depArgs?: unknown) => Map<string, any>;
  getRowSpanning(): Map<string, Set<RowSpanning>>;
  updateRowSpanning(): void;
}

export interface RowSpanningColumn<TData extends RowData> {
  tobedeleted?: boolean;
}

export interface RowSpanningCell<TData extends RowData> {
  getSpannedRowIndexes: () => Set<RowSpanning>;
  getIsSkipSinceRowSpanning: () => boolean;
  getIsRowSpanningRoot: () => boolean;
}

export const RowSpanningFeature: TableFeature<any> = {
  getInitialState: (state): RowSpanningTableState => {
    return {
      rowSpanningConfigurations: new Map(),
      rowSpanning: new Map(),
      ...state,
    };
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): RowSpanningOptions => {
    return {
      onRowSpanningConfigurationsChange: makeStateUpdater(
        'rowSpanningConfigurations',
        table
      ),
      onRowSpanningChange: makeStateUpdater('rowSpanning', table),
    } as RowSpanningOptions;
  },

  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setRowSpanningConfigurations = updater =>
      table.options.onRowSpanningConfigurationsChange?.(updater);
    table.setRowSpanning = updater =>
      table.options.onRowSpanningChange?.(updater);

    table.getRowSpanConf = memo(
      () => [table.getCenterRows()],
      rows => {
        const res = new Map<string, any>();
        if (rows.length) {
          rows[0].getVisibleCells().forEach(cell => {
            res.set(cell.column.id, cell.column.columnDef.meta?.rowSpanning);
          });
        }
        return res;
      }
    );
    // few features which like order row need to re-calculate row spanning
    table.updateRowSpanning = () => {
      const rowSpanning = table.getRowSpanning();
      if (rowSpanning) {
        table.setRowSpanning(rowSpanning);
      }
    };

    table.getRowSpanning = memo(
      () => [
        table.getCenterRows(),
        table.getRowSpanConf(),
        table.getIsEnableDraggableRow(),
        table.getState().orderedDraggableRows,
        table.getState().grouping,
        table.getState().masterCell,
        table.getState().columnFilters,
        table.getState().globalFilter,
        table.options.isCellExpandable,
      ],
      (rows, rowSpanConf, isEnableDraggableRow, orderedDraggableRows) => {
        const allRows = isEnableDraggableRow ? orderedDraggableRows : rows;
        const rowLen = allRows.length;
        const allVisibleCells = allRows.map(row => {
          return row.getVisibleCells();
        });

        const rowSpanning = new Map<string, Set<RowSpanning>>();
        
        if (!allVisibleCells.length) {
          return rowSpanning;
        }

        const columnLen = allVisibleCells[0].length;

        for (let colIndex = 0; colIndex < columnLen; colIndex++) {
          const rowSpan = rowSpanConf.get(
            allVisibleCells[0][colIndex].column.id
          );
          if (!rowSpan) {
            continue;
          }
          let rowIndex = 0;
          // current column
          for (rowIndex = 0; rowIndex < rowLen; rowIndex++) {
            // each row of current column
            const cell = allVisibleCells[rowIndex][colIndex];
            if (cell.getIsUnspannable()) {
              continue;
            }
            const spannedCells = new Set<RowSpanning>();
            let i = rowIndex + 1;
            for (; i < rowLen; i++) {
              const nextCell = allVisibleCells[i][colIndex];

              const isnextCellAggregated = nextCell.getIsAggregated();
              if (isnextCellAggregated) {
                break;
              }

              if (typeof rowSpan === 'boolean') {
                if (cell.getValue() === nextCell.getValue()) {
                  spannedCells.add({
                    rowIndex: i,
                    cellId: nextCell.id,
                  });
                } else {
                  break;
                }
              } else {
                if (rowSpan(cell, nextCell)) {
                  spannedCells.add({
                    rowIndex: i,
                    cellId: nextCell.id,
                  });
                } else {
                  break;
                }
              }
            }
            rowIndex = i - 1;
            if (spannedCells.size) {
              rowSpanning.set(cell.id, spannedCells);
            }
          }
        }
        return rowSpanning;
      }
    );
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
  ): void => {
    cell.getIsRowSpanningRoot = memo(
      () => [cell.getSpannedRowIndexes()],
      spannedRowState => {
        return spannedRowState.size > 0;
      }
    );
    cell.getSpannedRowIndexes = memo(
      () => [table.getState().rowSpanning],
      rowSpanning => {
        return rowSpanning.get(cell.id) ?? new Set();
      }
    );
    cell.getIsSkipSinceRowSpanning = memo(
      () => [table.getState().rowSpanning],
      rowSpanning => {
        let res = false;
        Array.from(rowSpanning.values()).forEach(rowSpanningItem => {
          if (res) {
            return;
          }
          Array.from(rowSpanningItem).forEach(item => {
            if (res) {
              return;
            }
            if (item.cellId === cell.id) {
              res = true;
            }
          });
        });
        return res;
      }
    );
  },
};
