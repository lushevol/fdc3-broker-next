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

export interface GroupingTreeTableState {
  groupingTreeColumnId?: string;
}
export interface GroupingTreeOptions {
  onGroupingTreeColumnIdChange: OnChangeFn<
    string | undefined
  >;
}
export interface GroupingTreeInstance {
  setOrderedRowIdViaDragging: (updater: Updater<string | undefined>) => void;
  getGroupTreeColumnId: () => string | undefined;
  setGroupTreeColumnId: (updater: Updater<string | undefined>) => void;
  getIsGroupTree: () => boolean;
}
export interface GroupingTreeColumn<TData extends RowData> {
  getIsGroupTreeColumn: () => boolean;
}
export interface GroupingTreeRow {
  /** String array of group tree path */
  getGroupTreePath: () => string[] | undefined;
  /** String array of full group tree path including leaf */
  getGroupTreeFullPath: () => string[] | undefined;
  /** String representing the leaf node of the group tree */
  getGroupTreeLeaf: () => string | undefined;

  getIsGroupTreeLeaf: () => boolean;
}
export interface GroupingTreeCell<TData extends RowData> {
  getIsGroupingTreeColumn: () => boolean;
}

export const GroupingTreeFeature: TableFeature<any> = {
  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): GroupingTreeOptions => {
    return {
      onGroupingTreeColumnIdChange: makeStateUpdater(
        'groupingTreeColumnId',
        table
      ),
    } as GroupingTreeOptions;
  },
  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.getGroupTreeColumnId = () => table.getState().groupingTreeColumnId;
    table.setGroupTreeColumnId = updater =>
      table.options.onGroupingTreeColumnIdChange(updater);

    table.getIsGroupTree = memo(
      () => [table.getState().grouping, table.getGroupTreeColumnId()],
      (grouping, columnId) =>
        !!columnId && grouping.includes(columnId)
    );
  },
  createColumn: <TData extends RowData>(
    column: Column<TData>,
    table: Table<TData>
  ): void => {
    column.getIsGroupTreeColumn = memo(
      () => [table.getState().groupingTreeColumnId, column.id],
      (groupingTreeColumnId, columnId) =>
        groupingTreeColumnId === columnId
    );
  },
  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>,
  ): void => {
    row.getGroupTreeFullPath = () => {
      const columnId = table.getGroupTreeColumnId();
      if (columnId) {
        const column = table.getColumn(columnId);
        if (column) {
          const getPath = column.columnDef.meta?.getGroupingTreePath;
          if (getPath) return getPath(row.original, row.index);
          if (!column?.accessorFn) return undefined;

          const value = column.accessorFn(row.original, row.index);
          const path = Array.isArray(value) ? value : [value];
          return path.map(v => `${v}`);
        }
      }
    };
    row.getGroupTreePath = () => row.getGroupTreeFullPath()?.slice(0, -1);
    row.getGroupTreeLeaf = () => row.getGroupTreeFullPath()?.slice(-1)[0];
    row.getIsGroupTreeLeaf = () =>
      row.depth + 1 === row.getGroupTreeFullPath()?.length;

    row.getValue = (columnId: string) => {
      if (!row._valuesCache.hasOwnProperty(columnId)) {
        if (columnId === table.getGroupTreeColumnId()) {
          row._valuesCache[columnId] = row.getGroupTreeLeaf();
        } else {
          // original implementation of getValue
          const column = table.getColumn(columnId);
          if (!column?.accessorFn) return undefined;
          row._valuesCache[columnId] = column.accessorFn(
            row.original as TData,
            row.index
          );
        }
      }
      return row._valuesCache[columnId] as any;
    };
  },
  createCell: <TData extends RowData, TValue>(
    cell: Cell<TData, TValue>,
    column: Column<TData>,
  ): void => {
    const _getIsPlaceholder = cell.getIsPlaceholder;
    cell.getIsPlaceholder = () =>
      _getIsPlaceholder() && !column.getIsGroupTreeColumn();
    cell.getIsGroupingTreeColumn = () => column.getIsGroupTreeColumn();
  },
};
