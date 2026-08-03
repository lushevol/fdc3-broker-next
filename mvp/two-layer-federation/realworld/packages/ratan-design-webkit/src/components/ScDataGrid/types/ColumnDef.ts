import type {
  CellContext,
  ColumnDefTemplate,
  RowData,
  StringOrTemplateHeader,
} from '@tanstack/lit-table';
import { ColumnSizingColumnDef } from './features/ColumnSizingDef.js';
import { CellDataTypesDef } from './features/CellDataTypesDef.js';
import { ColumnPinningColumnDef } from './features/ColumnPinningDef.js';
import { ColumnSpanningDef } from './features/ColumnSpanningDef.js';
import { RowSpanningDef } from './features/RowSpanningDef.js';
import { RowSortingDef } from './features/RowSortingDef.js';
import { ColumnStyleDef } from './features/ColumnStyleDef.js';
import { GroupingColumnDef } from './features/groupingDef.js';
import { RowDraggableDef } from './features/RowDraggableDef.js';
import { ColumnFilterDef } from './features/ColumnFilterDef.js';
import { ColumnManagerDef } from './features/ColumnManagerDef.js';
import { EditingDef } from './features/EditingDef.js';

// eslint-disable-next-line
export interface ColumnMeta<TData extends RowData, TValue> {}

interface ColumnDefExtensions<TData extends RowData, TValue = unknown>
  extends ColumnSizingColumnDef,
    CellDataTypesDef,
    ColumnPinningColumnDef,
    ColumnStyleDef,
    ColumnSpanningDef<TData, TValue>,
    RowSpanningDef<TData, TValue>,
    GroupingColumnDef<TData, TValue>,
    ColumnFilterDef,
    RowDraggableDef,
    ColumnManagerDef<TData, TValue>,
    EditingDef<TData, TValue>,
    RowSortingDef<TData> {}

export interface ColumnDefBase<TData extends RowData, TValue = unknown>
  extends ColumnDefExtensions<TData, TValue> {
  cell?: ColumnDefTemplate<CellContext<TData, TValue>>;
  meta?: ColumnMeta<TData, TValue>;
}

export interface StringHeaderIdentifier {
  header: string;
  id?: string;
}
export interface IdIdentifier<TData extends RowData, TValue> {
  id: string;
  header?: StringOrTemplateHeader<TData, TValue>;
}

type ColumnIdentifiers<TData extends RowData, TValue> =
  | IdIdentifier<TData, TValue>
  | StringHeaderIdentifier;

export type DisplayColumnDef<
  TData extends RowData,
  TValue = unknown
> = ColumnDefBase<TData, TValue> & ColumnIdentifiers<TData, TValue>;

export type AccessorFn<TData extends RowData, TValue = unknown> = (
  originalRow: TData,
  index: number
) => TValue;

export interface AccessorFnColumnDefBase<
  TData extends RowData,
  TValue = unknown
> extends ColumnDefBase<TData, TValue> {
  property: AccessorFn<TData, TValue>;
}

export type AccessorFnColumnDef<
  TData extends RowData,
  TValue = unknown
> = AccessorFnColumnDefBase<TData, TValue> & ColumnIdentifiers<TData, TValue>;

export interface AccessorKeyColumnDefBase<
  TData extends RowData,
  TValue = unknown
> extends ColumnDefBase<TData, TValue> {
  id?: string;
  property: string | keyof TData; // eslint-disable-line
}

export type AccessorKeyColumnDef<
  TData extends RowData,
  TValue = unknown
> = AccessorKeyColumnDefBase<TData, TValue> &
  Partial<ColumnIdentifiers<TData, TValue>>;

export type AccessorColumnDef<TData extends RowData, TValue = unknown> =
  | AccessorKeyColumnDef<TData, TValue>
  | AccessorFnColumnDef<TData, TValue>;

interface GroupColumnDefBase<TData extends RowData, TValue = unknown>
  extends ColumnDefBase<TData, TValue> {
  columns?: TColumn<TData, any>[];
}
export type GroupColumnDef<
  TData extends RowData,
  TValue = unknown
> = GroupColumnDefBase<TData, TValue> & ColumnIdentifiers<TData, TValue>;

export type TColumn<TData extends RowData, TValue = unknown> =
  | DisplayColumnDef<TData, TValue>
  | GroupColumnDef<TData, TValue>
  | AccessorColumnDef<TData, TValue>;
// ANA: not used for now | GroupColumnDef<TData, TValue>

export type { RowData };
