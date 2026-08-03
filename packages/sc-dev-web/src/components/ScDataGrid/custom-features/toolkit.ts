import {
  Cell,
  Column,
  Header,
  HeaderGroup,
  OnChangeFn,
  Row,
  RowData,
  RowModel,
  Table,
  TableFeature,
  Updater,
  buildHeaderGroups,
  makeStateUpdater,
} from '@tanstack/lit-table';
import { memo } from '../../../shared/memo.js';
import { RowSelectionMode, RowSelectionStrategy } from '../types/utils.js';
import { ROW_SELECTION_COLUMN_ID } from '../mixins/features/row-selection-mixin.js';

/**
 * key: row id
 * vlaue: cell
 * each row can only has one master cell which is expanded
 */
export type MasterState = Map<any, Cell<unknown, unknown>>;

// row height for each expanded master row
export type MasterRowHeightState = Map<any, number>;

export interface ToolkitTableState {
  /**
   * record expanded master cell for each row.
   */
  masterCell: MasterState;
  masterRowHeight: MasterRowHeightState;
}

export interface ToolkitRow {
  getIsMasterExpanded: () => boolean;
  getMasterCellId: () => string | undefined;
  getIsSubRowsSelected: () => false | 'all' | 'some';
  getIsIndeterminate: () => boolean;
  getIsRowSelectable: () => boolean;
  getIsUnvisibleSelection: () => boolean;
  getIsUnvisibleSelectionWhenSingleMode: () => boolean;
  getIsUnvisibleSelectionWhenHideManually: () => boolean;
  getIsRowSelected: () => boolean;
  getCell: (cellId?: string) => Cell<unknown, unknown> | undefined;
  getIndex: () => number;
  getColumn: (columnId: string) => Column<unknown> | undefined;
}

export interface ToolkitOptions {
  isCellExpandable?: (cell: Cell<unknown, unknown>) => boolean;
  onMasterCellChange?: OnChangeFn<MasterState>;
  onMasterRowHeightChange?: OnChangeFn<MasterRowHeightState>;
  rowSelectionStrategy?: RowSelectionStrategy;
  isRowSelectable?: (row: Row<unknown>) => boolean;
  hideUnselectableRows?: boolean;
  disableFlexibleColumnWidth?: boolean;
  filterMultipleRows?: boolean;
  rowSelectionMode?: RowSelectionMode;
  rowSelectionRadio?: boolean;
  isEnablePagination?: boolean;
  rowGroupOverrideSelectable?: boolean;
}

export interface ToolkitInstance<TData extends RowData> {
  setMasterCell: (updater: Updater<MasterState>) => void;
  setMasterRowHeight: (updater: Updater<MasterRowHeightState>) => void;
  getIsSubRowsSelected: () => false | 'all' | 'some';
  getIsIndeterminate: () => boolean;
  getIsSelectedAll: () => boolean;
  getIsSingleSelectionMode: () => boolean;
  getIsSelectionRadio: () => boolean;
  getSelectableRows: () => Row<TData>[];
  /** Get all selectable rows. `all`, default true, includes unselectable if 
   * parent rowGroup is selectable & `rowGroupOverrideSelectable` is true */
  getAllSelectableRows: (all?: boolean) => Row<TData>[];
  /** Get grouped rows to use in "select all". Can return all or paged, depending on strategy */
  getSelectableGroupRows: () => RowModel<TData>;
  calculateTableSizing(totalWidth: number): Record<string, number>;
  getCenterRowsAfterDragging: () => Row<TData>[];  
  /** Get all rows in the table, including top, center, and bottom rows. Maintains sorted order. */
  getAllRows: () => Row<TData>[];
  getAllHeaderGroups: () => HeaderGroup<TData>[];
  getHighestHeaders: () => Header<TData, unknown>[];
  getFlattenHeaders: () => Header<TData, unknown>[];
  getMaxDepth: () => number;
  getDeepestHeader: (
    header: Header<TData, unknown>
  ) => Header<TData, unknown>[];
  getAllLeafHeaders: () => Header<TData, unknown>[];
  getHeadersAt: (depth: number) => Header<TData, unknown>[];
  /** Header for each column in order */
  getColumnHeaders: () => Header<TData, unknown>[];
  /** Header for each visible column in order */
  getVisibleColumnHeaders: () => Header<TData, unknown>[];
  getAllGroupRows: () => Row<TData>[];
}

export interface ToolkitHeader<TData extends RowData> {
  /** Visible column index for this header */
  getColIndex: () => number;
  /** Visible row index for this header */
  getRowIndex: () => number;
  getHeaders: () => Header<TData, unknown>[];
  getLeafsOnly: () => Header<TData, unknown>[];
}

export interface ToolkitColumn<TData extends RowData> {
  getAdjacentColumns: () => {
    prevColumn: Column<TData, unknown> | undefined;
    nextColumn: Column<TData, unknown> | undefined;
  };
  getNextColumns: (count: number) => Column<TData, unknown>[];
  isRowSelection: () => boolean;
  getIsHasSubColumns: () => boolean;
  getIsInheritedPinned: () => false | 'left' | 'right';
  hasId: (id: string) => boolean;
  getHeader: () => Header<TData, unknown> | undefined;
  getIsOrderingLocked: () => boolean;
}

export interface ToolkitCell<TData extends RowData> {
  /**
   * Master cell is expandable or not
   * @returns boolean
   */
  getIsExpandableMaster: () => boolean;
  _getIsExpandableMaster: () => boolean;
  getIsUnspannable: () => boolean;
  /**
   * Master cell is expanded or not
   * @returns boolean
   */
  getIsExpanded: () => boolean;
  toggleExpanded: (expanded?: boolean) => void;
  isDisabledMaster: () => boolean;
  getIsColumnHasExpandedMasterCell: () => boolean;
  getUIState: () => {
    isExpandable: boolean;
    isExpanded: boolean;
    isPlaceholder: boolean;
    isAggregated: boolean;
  };
  /** Visible column index for this cell */
  getColIndex: () => number;
  /** Visible row index for this cell */
  getRowIndex: () => number;
}

export const ToolkitFeature: TableFeature<any> = {
  getInitialState: (state): ToolkitTableState => {
    return {
      masterCell: new Map(),
      masterRowHeight: new Map(),
      ...state,
    };
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): ToolkitOptions => {
    return {
      onMasterCellChange: makeStateUpdater('masterCell', table),
      onMasterRowHeightChange: makeStateUpdater('masterRowHeight', table),
    } as ToolkitOptions;
  },
  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setMasterCell = updater =>
      table.options.onMasterCellChange?.(updater);
    table.setMasterRowHeight = updater =>
      table.options.onMasterRowHeightChange?.(updater);

    table.getIsSelectedAll = memo(
      () => [table.getIsSubRowsSelected()],
      subRowSelectedStatus => {
        return subRowSelectedStatus === 'all';
      }
    );
    table.getIsIndeterminate = memo(
      () => [table.getIsSubRowsSelected()],
      subRowSelectedStatus => {
        return subRowSelectedStatus === 'some';
      }
    );
    table.getSelectableRows = memo(
      () => [
        table.options.rowSelectionStrategy,
        table.getCoreRowModel(),
        table.getState().pagination,
        table.getState().columnFilters,
        table.getState().globalFilter,
        table.options.isRowSelectable,
      ],
      rowSelectionStrategy => {
        let rows: Row<TData>[] = [];
        if (rowSelectionStrategy === 'all') {
          rows = table.getPrePaginationRowModel().flatRows;
        } else if (rowSelectionStrategy === 'currentPage') {
          rows = table.getPaginationRowModel().flatRows;
        }
        const rowsWithoutGrouped = rows.filter(
          row => !row.getIsGrouped() && row.getIsRowSelectable()
        );
        return rowsWithoutGrouped;
      }
    );
    table.getAllSelectableRows = memo(
      (all = true) => [
        all,
        table.getPrePaginationRowModel(),
        table.getCoreRowModel(),
        table.getState().columnFilters,
        table.getState().globalFilter,
        table.options.isRowSelectable,
        table.options.rowGroupOverrideSelectable,
      ],
      (all, model) => {
        const rows = [...new Set(model.flatRows)];
        const rowsWithoutGrouped = rows.filter(
          row =>
            !row.getIsGrouped() &&
            (row.getIsRowSelectable() ||
              (all && table.options.rowGroupOverrideSelectable &&
                row.getParentRow()?.getIsRowSelectable()))
        );
        return rowsWithoutGrouped;
      }
    );
    table.getSelectableGroupRows = memo(
      () => [
        table.options.rowSelectionStrategy,
        table.getGroupedRowModel(),
        table.getPaginationRowModel(),
      ],
      (strategy, grouped, paged) => {
        if (strategy === 'currentPage')
          return { ...paged, rows: paged.rows.filter(r => r.depth === 0) };
        return grouped;
      }
    );

    table.getIsSubRowsSelected = memo(
      () => [
        table.getSelectableGroupRows().flatRows,
        table.getState().rowSelection,
        table.getState().pagination.pageIndex,
      ],
      rows => {
        if (!rows.length) return false;

        let allSelected = true,
          someSelected = false;
        rows.filter(r => !r.subRows?.length).find(row => {
          const isSelected = row.getIsSelected();
          allSelected &&= isSelected;
          someSelected ||= isSelected;
          return !isSelected && someSelected;
        });
        return allSelected ? 'all' : someSelected ? 'some' : false;
      }
    );

    table.getIsSingleSelectionMode = memo(
      () => [table.options.rowSelectionMode],
      rowSelectionMode => {
        return rowSelectionMode === 'single';
      }
    );

    table.getIsSelectionRadio = memo(
      () => [table.options.rowSelectionMode, table.options.rowSelectionRadio],
      (rowSelectionMode, radio) => {
        return rowSelectionMode === 'single' && !!radio;
      }
    );

    table.getAllHeaderGroups = memo(
      () => [
        table.getAllColumns(),
        table.getAllLeafColumns(),
        table.getState().columnPinning.left,
        table.getState().columnPinning.right,
      ],
      (allColumns, leafColumns, left, right) => {
        const leftColumns =
          left
            ?.map(columnId => leafColumns.find(d => d.id === columnId)!)
            .filter(Boolean) ?? [];

        const rightColumns =
          right
            ?.map(columnId => leafColumns.find(d => d.id === columnId)!)
            .filter(Boolean) ?? [];

        const centerColumns = leafColumns.filter(
          column => !left?.includes(column.id) && !right?.includes(column.id)
        );

        const headerGroups = buildHeaderGroups(
          allColumns,
          [...leftColumns, ...centerColumns, ...rightColumns],
          table
        );

        return headerGroups;
      }
    );

    table.getAllLeafHeaders = memo(
      () => [table.getAllHeaderGroups()],
      getAllHeaderGroups => {
        const headers: Header<TData, unknown>[] = [];
        getAllHeaderGroups.forEach(headerGroup => {
          headers.push(...headerGroup.headers);
        });
        return headers;
      }
    );

    table.calculateTableSizing = (
      totalWidth: number
    ): Record<string, number> => {
      let totalAvailableWidth = totalWidth;
      let totalIsGrow = 0;
      const columns = table.getAllLeafColumns();

      columns.forEach(column => {
        if (column.getIsHasSubColumns() || !column.getIsVisible()) {
          return;
        }
        const columnDef = column.columnDef;
        const flex = getFlex(table, column);

        if (flex) {
          totalIsGrow += flex;
        } else {
          totalAvailableWidth -= getSize(
            columnDef.size,
            columnDef.maxSize,
            columnDef.minSize
          );
        }
      });

      const sizing: Record<string, number> = {};

      const flexUnitWidth = ~~(totalAvailableWidth / totalIsGrow);

      columns.forEach(column => {
        const columnDef = column.columnDef;
        const flex = getFlex(table, column);
        if (flex) {
          let calculatedSize = 100;
          calculatedSize = flexUnitWidth * flex;
          const size = getSize(
            calculatedSize,
            columnDef.maxSize,
            columnDef.minSize
          );
          columnDef.size = size;
        }

        sizing[`${column.id}`] = Number(columnDef.size);
      });

      return sizing;
    };
    table.getHighestHeaders = () => {
      return table
        .getAllHeaderGroups()
        .filter(HeaderGroup => HeaderGroup.depth === 0)[0]
        .headers.filter(header => header.column.id !== ROW_SELECTION_COLUMN_ID);
    };
    table.getFlattenHeaders = memo(
      () => [table.getHighestHeaders()],
      highestHeaders => {
        const res = [];
        const headers = [...highestHeaders];
        while (headers.length) {
          const header = headers.shift();
          if (header) {
            res.push(header);
            headers.push(...header.subHeaders);
          }
        }
        return res;
      }
    );

    table.getMaxDepth = memo(
      () => [table.getAllColumns()],
      allColumns => {
        let maxDepth = 0;

        const findMaxDepth = (columns: Column<TData, unknown>[], depth = 1) => {
          maxDepth = Math.max(maxDepth, depth);

          columns
            .filter(column => column.getIsVisible())
            .forEach(column => {
              if (column.columns?.length) {
                findMaxDepth(column.columns, depth + 1);
              }
            }, 0);
        };
        findMaxDepth(allColumns);
        return maxDepth;
      }
    );
    table.getDeepestHeader = memo(
      header => [header, table.getMaxDepth()],
      (header, maxDepth) => {
        return (
          header
            ?.getLeafHeaders()
            ?.filter(header => header.depth === maxDepth) ?? []
        );
      }
    );
    table.getCenterRowsAfterDragging = memo(
      () => [
        table.getCenterRows(),
        table.getState().orderedDraggableRows,
        table.getIsEnableDraggableRow(),
      ],
      (centerRows, orderedDraggableRows, isEnableDraggableRow) => {
        return isEnableDraggableRow ? orderedDraggableRows : centerRows;
      }
    );

    table.getAllRows = memo(
      () => [table.getTopRows(), table.getCenterRows(), table.getBottomRows()],
      (top, center, bottom) => {
        return [...top, ...center, ...bottom];
      }
    );

    table.getHeadersAt = memo(
      depth => [
        table.getLeftHeaderGroups(),
        table.getCenterHeaderGroups(),
        table.getRightHeaderGroups(),
        depth,
      ],
      (left, center, right, depth) => {
        return [
          ...(left.find(g => g.depth === depth)?.headers ?? []),
          ...(center.find(g => g.depth === depth)?.headers ?? []),
          ...(right.find(g => g.depth === depth)?.headers ?? []),
        ];
      }
    );

    table.getColumnHeaders = memo(
      () => [table.getAllHeaderGroups()],
      headerGroups => headerGroups[headerGroups.length - 1].headers
    );

    table.getVisibleColumnHeaders = memo(
      () => [table.getColumnHeaders()],
      headers => headers.filter(h => h.column.getIsVisible())
    );

    table.getAllGroupRows = memo(
      () => [table.getGroupedRowModel().rowsById],
      rowsById => Object.values(rowsById).filter(row => row.getIsGrouped())
    );
  },

  createHeader: <TData extends RowData>(
    header: Header<TData, unknown>,
    table: Table<TData>
  ): void => {
    header.getRowIndex = memo(
      () => [table.getAllHeaderGroups(), header.column.getIsPinned()],
      (headerGroups, isPinned) => {
        const pinned = isPinned || 'center';
        const groupId = header.headerGroup.id.replace(`${pinned}_`, '');
        return headerGroups.findIndex(g => g.id === groupId);
      }
    );
    header.getColIndex = memo(
      () => [table.getHeadersAt(header.headerGroup.depth)],
      list => {
        // const headerGroup = headerGroups.find(g => g.depth === header.headerGroup.depth);
        let index = 0;
        if (
          list.find(h => {
            if (h.id === header.id) return true;
            index += h.colSpan;
            return false;
          })
        ) {
          return index;
        }
        return -1;
      }
    );
    header.getHeaders = memo(
      () => [table.getHeadersAt(header.headerGroup.depth)],
      list => list
    );
    header.getLeafsOnly = () => {
      function recurse(header: Header<TData, unknown>): Header<TData, unknown>[] {
        if (header.subHeaders.length === 0) {
          return [header];
        }
        return header.subHeaders.flatMap(recurse);
      }
      return recurse(header);
    };
  },

  createColumn: <TData extends RowData, TValue>(
    column: Column<TData, TValue>,
    table: Table<TData>
  ): void => {
    column.getIsInheritedPinned = () => {
      let currentColumn: Column<TData, TValue> | undefined = column;
      let isLeft = false;
      let isRight = false;
      while (currentColumn) {
        const pinned = currentColumn.columnDef.meta?.pinned;
        if (pinned === 'left') {
          isLeft = true;
        } else if (pinned === 'right') {
          isRight = true;
        }
        if (isLeft || isRight) {
          break;
        }
        currentColumn = currentColumn.parent;
      }
      return isLeft ? 'left' : isRight ? 'right' : false;
    };
    column.getIsHasSubColumns = () => {
      return Array.isArray(column.columns) && column.columns.length > 0;
    };
    column.isRowSelection = () => {
      return column.id === ROW_SELECTION_COLUMN_ID;
    };
    column.getNextColumns = memo(
      count => [column.getColumnsByPinning(column.id), count],
      (columnsByPinning, count = 0) => {
        const end = Math.max(count, 0);
        const index = column.getIndex(column.getIsPinned() || 'center');

        const res: Column<TData, unknown>[] = [];
        for (let i = index + 1; i < index + 1 + end; ++i) {
          if (i >= columnsByPinning.length) {
            break;
          }
          const column = columnsByPinning[i];
          if (column.getIsGrouped()) {
            break;
          }
          res.push(column);
        }

        return res;
      }
    );

    column.getAdjacentColumns = memo(
      () => [column.getColumnsByPinning(column.id)],
      columnsByPinning => {
        const pinningPosition = column.getIsPinned() || 'center';
        const index = column.getIndex(pinningPosition);
        return {
          prevColumn: columnsByPinning[index - 1],
          nextColumn: columnsByPinning[index + 1],
        };
      }
    );

    column.hasId = (id: string) => {
      let col: Column<TData, TValue> | undefined = column;
      while (col) {
        if (col.id === id) return true;
        col = col.parent;
      }
      return false;
    };
    column.getHeader = memo(
      () => [table.getAllLeafHeaders()],
      headers =>
        headers.find(h => h.column.id === column.id && !h.isPlaceholder)
    );
    column.getIsOrderingLocked = () =>
      ['ordering', true].includes(column.columnDef.meta?.lock || false);
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>
  ): void => {
    row.getIsSubRowsSelected = memo(
      () => [table.getState().rowSelection],
      () => {
        let isSomeSelected = false;
        let isAllSelected = true;

        function fn(rows: Row<TData>[]) {
          for (let i = 0, len = rows.length; i < len; ++i) {
            if (isSomeSelected && !isAllSelected) {
              break;
            }
            const row = rows[i];
            const isRowGrouped = row.getIsGrouped();
            if (isRowGrouped) {
              fn(row.subRows);
            } else {
              if (row.getIsSelected()) {
                isSomeSelected = true;
              } else {
                isAllSelected = false;
              }
            }
          }
        }
        fn([row]);
        return isAllSelected ? 'all' : isSomeSelected ? 'some' : false;
      }
    );
    row.getIsRowSelected = memo(
      () => [
        row.getIsGrouped(),
        row.getIsSubRowsSelected(),
        row.getIsSelected(),
      ],
      (isGroupedRow, subRowSelectedStatus, isSingleRowSelected) => {
        return isGroupedRow
          ? subRowSelectedStatus === 'all'
          : isSingleRowSelected;
      }
    );
    row.getIsIndeterminate = memo(
      () => [row.getIsGrouped(), row.getIsSubRowsSelected()],
      (isGroupedRow, subRowSelectedStatus) => {
        return isGroupedRow ? subRowSelectedStatus === 'some' : false;
      }
    );
    row.getIsRowSelectable = memo(
      () => [table.options.isRowSelectable],
      isRowSelectable => {
        return isRowSelectable?.(row as Row<unknown>) ?? true;
      }
    );
    row.getIsUnvisibleSelectionWhenSingleMode = memo(
      () => [row.getIsGrouped(), table.getIsSingleSelectionMode()],
      (isRowgrouped, isSingleSelectionMode) => {
        return isRowgrouped && isSingleSelectionMode;
      }
    );
    row.getIsUnvisibleSelectionWhenHideManually = memo(
      () => [row.getIsRowSelectable(), table.options.hideUnselectableRows],
      (isRowSelectable, hideUnselectableRows) => {
        if (hideUnselectableRows && !isRowSelectable) {
          return true;
        }
        return false;
      }
    );
    row.getIsUnvisibleSelection = memo(
      () => [
        row.getIsUnvisibleSelectionWhenSingleMode(),
        row.getIsUnvisibleSelectionWhenHideManually(),
      ],
      (isUnvisibleWhenSingle, isUnvisibleWhenHide) => {
        if (isUnvisibleWhenSingle || isUnvisibleWhenHide) {
          return true;
        }
        return false;
      }
    );
    row.getIsMasterExpanded = memo(
      () => [table.getState().masterCell],
      masterCell => {
        return masterCell.has(row.id);
      }
    );
    row.getMasterCellId = memo(
      () => [table.getState().masterCell],
      masterCell => {
        return masterCell.get(row.id)?.id;
      }
    );
    row.getCell = (cellId?: string) => {
      return row.getVisibleCells().find(cell => cell.id === cellId) as Cell<
        unknown,
        unknown
      >;
    };

    row.getIndex = memo(
      () => [table.getAllRows()],
      rows => rows.findIndex(r => r.id === row.id)
    );
    row.getColumn = (columnId: string) =>
      table.getColumn(columnId) as Column<unknown>;
  },

  createCell: <TData extends RowData, TValue>(
    cell: Cell<TData, TValue>,
    column: Column<TData, TValue>,
    row: Row<TData>,
    table: Table<TData>
  ): void => {
    // master detail expanding
    // cells which not pinned and not in grouping level can be master cell
    cell.getIsExpandableMaster = memo(
      () => [cell, cell._getIsExpandableMaster(), cell.column.isRowSelection()],
      (cell, expandable, isRowSelection) => {
        if (isRowSelection) {
          return false;
        }
        if (cell.isDisabledMaster()) {
          return false;
        }
        return expandable;
      }
    );
    cell._getIsExpandableMaster = memo(
      () => [cell, table.options.isCellExpandable],
      (cell, isCellExpandable) => {
        if (!isCellExpandable) {
          return false;
        }
        return isCellExpandable(cell as Cell<unknown, unknown>);
      }
    );

    cell.getIsUnspannable = memo(
      () => [
        cell.getIsAggregated(),
        cell._getIsExpandableMaster(),
        table.options.isCellExpandable,
      ],
      (isAggregated, expandable) => {
        if (isAggregated) {
          return true;
        }
        if (expandable) {
          return true;
        }
        return false;
      }
    );
    cell.toggleExpanded = (expanded?: boolean) => {
      if (!cell.getIsExpandableMaster()) {
        return;
      }
      table.setMasterCell(old => {
        const isExpanded = cell.getIsExpanded();

        const finalizedExpanded = expanded ?? !isExpanded;
        if (isExpanded && finalizedExpanded) {
          old.delete(row.id);
        }
        if (!isExpanded && finalizedExpanded) {
          old.set(row.id, cell as Cell<unknown, unknown>);
        }

        return new Map(old);
      });
    };
    // used for master cell
    cell.getIsExpanded = memo(
      () => [table.getState().masterCell, cell.column.isRowSelection()],
      (masterCell, isRowSelection) => {
        if (isRowSelection) {
          return false;
        }
        return Array.from(masterCell.values()).some(
          masterCell => masterCell.id === cell.id
        );
      }
    );
    cell.getUIState = memo(
      () => [
        // true if current column or current cell is grouped
        cell.getIsPlaceholder(),
        cell.getIsAggregated(),
        cell.row.getIsGrouped(),
        cell.getIsGrouped(),
        cell.row.getIsExpanded(),
        cell.getIsExpandableMaster(),
        cell.getIsExpanded(),
      ],
      (
        isPlaceholder,
        isAggregated,
        isGroupedRow,
        isExpandableGroupingColumn,
        isExpandedGroupingRow,
        isExpandableMasterCell,
        isExpandedMasterCell
      ) => {
        let isExpandable;
        let isExpanded;
        if (isGroupedRow) {
          // ANA: grouping will remove other features
          // client-side grouping
          // cell is expandable when grouping
          isExpandable = isExpandableGroupingColumn;
          // is current row expanded or not
          isExpanded = isExpandedGroupingRow;
        } else {
          isExpandable = isExpandableMasterCell;
          isExpanded = isExpandedMasterCell;
        }
        return {
          isExpandable,
          isExpanded,
          isPlaceholder,
          isAggregated,
        };
      }
    );
    cell.getIsColumnHasExpandedMasterCell = memo(
      () => [table.getState().masterCell],
      masterCell => {
        return Array.from(masterCell.values())
          .map(cell => cell.column.id)
          .some(masterCellColumnId => masterCellColumnId === cell.column.id);
      }
    );

    cell.isDisabledMaster = memo(
      () => [
        row.getIsPinned(),
        column.getIsPinned(),
        cell.getIsAggregated(),
        cell.getIsPlaceholder(),
        cell.getIsGrouped(),
      ],
      (
        isRowPinned,
        isColumnPinned,
        isAggregatedCell,
        isPlaceholderCell,
        isGroupedCell
      ) => {
        // grouped cell can not be a master cell
        if (isAggregatedCell || isPlaceholderCell) {
          return true;
        }
        // pinned row can not be a master cell
        if (isRowPinned) {
          return true;
        }
        if (isGroupedCell) {
          return true;
        }
        return false;
      }
    );

    cell.getColIndex = () =>
      column.getHeader()?.getColIndex() ?? column.getIndex();
    cell.getRowIndex = () => row.getIndex();
  },
};

function getSize(size = 10, max = Number.MAX_SAFE_INTEGER, min = 10) {
  return Math.max(Math.min(size, max), min);
}

function getFlex<TData extends RowData>(
  table: Table<TData>,
  column: Column<TData, unknown>
) {
  let res;
  if (column.isRowSelection()) {
    return res;
  }
  const columnSizing = table.getState().columnSizing;
  if (!columnSizing[column.id]) {
    if (column.columnDef.meta?.flex) {
      res = column.columnDef.meta?.flex;
    } else if (!column.columnDef.meta?.size) {
      if (!table.options.disableFlexibleColumnWidth) {
        res = 1;
      }
    }
  }
  return res;
}
