import { Column, FilterFn, Table } from '@tanstack/lit-table';

export type BindFilterValue<T = unknown> = (value: T) => void;

export type FilterLookup = (props: {
  keyword?: any;
  column: Column<any, any>;
  table: Table<any>;
}) => Promise<any>;

export type FilterWidgetProps<T = unknown> = {
  value: T | undefined;
  bindFilterValue: BindFilterValue<T | undefined>;
  table: Table<unknown>;
  column: Column<unknown, unknown>;
  filterDef?: FilterDef;
};
export type FilterWidget = <T = unknown>(props: FilterWidgetProps<T>) => any;

export interface FilterDef {
  /**
   * customized filter content
   * @param column current column instance
   * @param table table instance
   * @returns customized filter content
   */
  filterWidget?: FilterWidget;
  filterFn?: FilterFn<unknown>;
  /**
   * specific filter name: text, number, multiple, etc
   * defaults to filterType or column data type
   */
  filter?: string;
  filterParams?: FilterParam;
  /**
   * which filter type user want to user. ex: number, date, boolean etc.
   */
  filterType?: string; // ANA: do not expose this one for now.
}

export interface ColumnFilterDef extends FilterDef {
  /**
   * enable of disable column filter
   */
  filterable?: boolean;
  /**
   * get dunamic data for column set filter
   * @param keyword search text
   * @param column current column instance
   * @param table table instance
   * @returns customized data
   */
  filterLookup?: FilterLookup;
  /**
   * how many filter modes user want to use, ex equal, greater than, empty, between etc.
   * @deprecated moved to filterParams.options
   */
  filterModes?: string[];
}

export interface FilterParam {
  /** list of modes available; ie equal, greater than, empty, etc */
  modes?: string[];
  defaultMode?: string;
  /** multiple filter only, config for each sub config */
  filters?: FilterDef[];
}

export interface IFilterModeEquals<T> {
  equals?: T;
  notEquals?: T;
}
export interface IFilterModeEmpty {
  empty?: boolean;
  notEmpty?: boolean;
}

export interface IFilterModeBetweenValue<T> {
  start?: T; 
  end?: T;
}
export interface IFilterModeBetween<T> {
  between?: IFilterModeBetweenValue<T>;
}
export interface IFilterModeInArray<T> {
  inArray?: T[];
}

export interface StringFilterMode<T = string>
  extends IFilterModeEquals<T>,
    IFilterModeEmpty,
    IFilterModeInArray<T> {
  contains?: T;
  notContains?: T;
  beginsWith?: T;
  endsWith?: T;
}
export interface NumberFilterMode<T = number>
  extends IFilterModeEquals<T>,
    IFilterModeBetween<T>,
    IFilterModeEmpty,
    IFilterModeInArray<T> {
  greaterThan?: T;
  lessThan?: T;
  greaterThanOrEqual?: T;
  lessThanOrEqual?: T;
}
export interface DateFilterMode<T = Date | string | number>
  extends IFilterModeEquals<T>,
    IFilterModeBetween<T>,
    IFilterModeEmpty,
    IFilterModeInArray<T> {
  before?: T;
  after?: T;
}
export type AllFilterMode = 
  & StringFilterMode
  & NumberFilterMode
  & DateFilterMode;
export type AnyFilterMode = 
  | StringFilterMode
  | NumberFilterMode
  | DateFilterMode;

export type AnyFilterData =
  | string[]
  | MultiFilterData
  | undefined;

export interface TypedFilterData<K extends (string & keyof T),
T = AllFilterMode
> {
  mode: K;
  value: T[K];
}

export interface MultiFilterData
  extends Partial<
    TypedFilterData<string & keyof AllFilterMode, AllFilterMode>
  > {
  logic?: 'and' | 'or';
  secondary?: TypedFilterData<string & keyof AllFilterMode, AllFilterMode>;
}

export type MultiFilters = AnyFilterData[];