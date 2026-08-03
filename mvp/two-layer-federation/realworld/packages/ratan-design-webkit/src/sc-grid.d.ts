import '@tanstack/lit-table';

import {
  ColumnSpanningTableState,
  ColumnSpanningOptions,
  ColumnSpanningInstance,
  ColumnSpanningColumn,
  ColumnSpanningCell,
} from './components/ScDataGrid/custom-features/column-spanning.js';

import {
  RowSpanningTableState,
  RowSpanningOptions,
  RowSpanningInstance,
  RowSpanningColumn,
  RowSpanningCell,
} from './components/ScDataGrid/custom-features/row-spanning.js';

import {
  ColumnTypeTableState,
  ColumnTypeOptions,
  ColumnTypeInstance,
  ColumnTypeHeader,
  ColumnTypeColumn,
  ColumnTypeCell,
} from './components/ScDataGrid/custom-features/column-type.js';

import {
  ToolkitTableState,
  ToolkitOptions,
  ToolkitInstance,
  ToolkitColumn,
  ToolkitCell,
  ToolkitRow,
  ToolkitHeader,
} from './components/ScDataGrid/custom-features/toolkit.js';

import {
  RowHeightTableState,
  RowHeightOptions,
  RowHeightInstance,
  RowHeightColumn,
  RowHeightCell,
  RowHeightRow,
} from './components/ScDataGrid/custom-features/row-height.js';

import {
  EditingCellTableState,
  EditingCellOptions,
  EditingCellInstance,
  EditingCellColumn,
  EditingCellCell,
  EditingCellRow,
} from './components/ScDataGrid/custom-features/editing.js';

import {
  RowDraggableTableState,
  RowDraggableOptions,
  RowDraggableInstance,
  RowDraggableColumn,
  RowDraggableCell,
  RowDraggableRow,
} from './components/ScDataGrid/custom-features/row-draggable.js';

import {
  GroupingTreeTableState,
  GroupingTreeOptions,
  GroupingTreeInstance,
  GroupingTreeColumn,
  GroupingTreeRow,
  GroupingTreeCell,
} from './components/ScDataGrid/custom-features/grouping-tree.js';

import { SortDirection } from './components/ScDataGrid/types/features/RowSortingDef.js';
import { RowSpanningDef } from './components/ScDataGrid/types/features/RowSpanningDef.js';
import { ColumnSpanningDef } from './components/ScDataGrid/types/features/ColumnSpanningDef.js';
import { CellDataTypesDef } from './components/ScDataGrid/types/features/CellDataTypesDef.js';
import { GroupingColumnDef } from './components/ScDataGrid/types/features/groupingDef.js';
import {
  EditingDef,
  TCellEditorParams,
  TCellEditor,
} from './components/ScDataGrid/types/features/EditingDef.js';
import { ColumnStyleDef } from './components/ScDataGrid/types/features/ColumnStyleDef.js';
import { ColumnManagerDef } from './components/ScDataGrid/types/features/ColumnManagerDef.js';
import {
  FilterLookup,
  FilterParam,
  FilterWidget,
} from './components/ScDataGrid/types/features/ColumnFilterDef.js';

declare module '@tanstack/lit-table' {
  // for metadata
  interface ColumnMeta<TData extends RowData, TValue> {
    size?: number;
    flex?: number;
    pinned?: 'left' | 'right';
    draggable?: boolean;
    sortingOrder?: SortDirection[];
    rowSpanning?: RowSpanningDef<TData, TValue>['rowSpanning'];
    colSpanning?: ColumnSpanningDef<TData, TValue>['colSpanning'];
    rowGrouping?: boolean;
    rowGroupingTree?: boolean;
    editable?: EditingDef['editable'];
    cellEditorParams?: TCellEditorParams;
    cellEditor?: TCellEditor;
    cellDataType?: CellDataTypesDef['cellDataType'];
    sort?: SortDirection;
    filterType?: string;
    filter?: string;
    filterParams?: FilterParam;
    filterModes?: string[];
    columnManagerLabel?: ColumnManagerDef<TData, TValue>['columnManagerLabel'];
    hide?: ColumnManagerDef<TData, TValue>['hide'];
    lock?: ColumnManagerDef<TData, TValue>['lock'];
    filterLookup?: FilterLookup;
    filterWidget?: FilterWidget;
    getCellStyle?: ColumnStyleDef['getCellStyle'];
    getHeaderStyle?: ColumnStyleDef['getHeaderStyle'];
    getGroupingTreePath?: GroupingColumnDef<Data, TValue>['getGroupingTreePath'];
  }

  // === Custom features start ===
  interface TableState
    extends
      ColumnSpanningTableState,
      RowSpanningTableState,
      ColumnTypeTableState,
      RowHeightTableState,
      EditingCellTableState,
      RowDraggableTableState,
      GroupingTreeTableState,
      ToolkitTableState {}

  interface TableOptionsResolved<TData extends RowData>
    extends
      ColumnSpanningOptions,
      RowSpanningOptions,
      ColumnTypeOptions,
      RowHeightOptions,
      EditingCellOptions,
      RowDraggableOptions,
      GroupingTreeOptions,
      ToolkitOptions {}

  interface Table<TData extends RowData>
    extends
      ColumnSpanningInstance,
      RowSpanningInstance<TData>,
      ColumnTypeInstance,
      RowHeightInstance,
      EditingCellInstance,
      RowDraggableInstance,
      GroupingTreeInstance,
      ToolkitInstance<TData> {}

  interface Column<TData extends RowData, TValue>
    extends
      ColumnSpanningColumn<TData>,
      RowSpanningColumn<TData>,
      ColumnTypeColumn<TData, TValue>,
      RowHeightColumn<TData>,
      EditingCellColumn<TData>,
      RowDraggableColumn<TData>,
      GroupingTreeColumn<TData>,
      ToolkitColumn<RowData> {}

  interface Cell<TData extends RowData, TValue>
    extends
      ColumnSpanningCell<TData>,
      RowSpanningCell<TData>,
      ColumnTypeCell<TData>,
      RowHeightCell<TData>,
      EditingCellCell<TData>,
      RowDraggableCell<TData>,
      GroupingTreeCell<TData>,
      ToolkitCell<TData> {}

  interface Row<TData extends RowData>
    extends RowHeightRow, EditingCellRow, RowDraggableRow, GroupingTreeRow, ToolkitRow {
    needToDelete?: boolean;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Header<TData extends RowData> extends ColumnTypeHeader, ToolkitHeader<TData> {}
  // === Custom features end ===
}

interface Window {
  trustedTypes?: {
    createPolicy<Options extends TrustedTypePolicyOptions>(
      policyName: string,
      policyOptions: Options,
    ): TrustedTypePolicy;
    isHTML(value: any): value is TrustedHTML;
    isScript(value: any): value is TrustedScript;
    isScriptURL(value: any): value is TrustedScriptURL;
    readonly emptyHTML: TrustedHTML;
    readonly emptyScript: TrustedScript;
  };
}
