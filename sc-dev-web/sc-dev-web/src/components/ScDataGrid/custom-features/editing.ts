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
import { TCellEditor, TCellEditorParams } from '../types/features/EditingDef.js';

export type EditingCells = Map<Cell<unknown, unknown>, boolean>;

export interface EditingCellTableState {
  editingCells: EditingCells;
}

export interface EditingCellOptions {
  onEditingCellsChange?: OnChangeFn<EditingCells>;
}

export interface EditingCellInstance {
  setEditingCells: (updater: Updater<EditingCells>) => void;
  getHasCellInEditing: () => boolean;
}

export interface EditingCellColumn<TData extends RowData> {
  getCellEditor: () => TCellEditor | undefined;
  getCellEditorParams: () => TCellEditorParams | undefined;
}

export interface EditingCellRow {
  nd?: any
}
export interface EditingCellCell<TData extends RowData> {
  getIsEditable: () => boolean;
}

export const EditingCellFeature: TableFeature<any> = {
  getInitialState: (state): EditingCellTableState => {
    return {
      editingCells: new Map(),
      ...state,
    };
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): EditingCellOptions => {
    return {
      onEditingCellsChange: makeStateUpdater('editingCells', table),
    } as EditingCellOptions;
  },
  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setEditingCells = updater =>
      table.options.onEditingCellsChange?.(updater);

    table.getHasCellInEditing = memo(
      () => [table.getState().editingCells],
      editingCells => {
        return Array.from(editingCells.values()).filter(Boolean).length > 0;
      }
    );
  },
  createColumn: <TData extends RowData, TValue>(
    column: Column<TData, TValue>,
    table: Table<TData>
  ): void => {
    column.getCellEditor = memo(
      () => [column.columnDef.meta?.cellEditor],
      cellEditor => {
        return cellEditor;
      }
    );
    column.getCellEditorParams = memo(
      () => [column.columnDef.meta?.cellEditorParams],
      cellEditorParams => {
        return cellEditorParams;
      }
    );
  },
  createCell: <TData extends RowData, TValue>(
    cell: Cell<TData, TValue>,
    column: Column<TData, TValue>,
    row: Row<TData>,
    table: Table<TData>
  ): void => {
    cell.getIsEditable = memo(
      () => [column.columnDef.meta?.editable],
      editable => {
        return editable instanceof Function ? editable(cell) : editable;
      }
    );
  },
  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>
  ): void => {},
};
