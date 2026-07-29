import { FilterFn, RowData } from '@tanstack/lit-table';
import dayjs from 'dayjs/esm/index.js';
import { getTag } from '../../../shared/isEuqalWith/getTag.js';
import { objectTag } from '../../../shared/isEuqalWith/tags.js';
import { isEmptyish, isNotEmptyish } from '../../../shared/util.js';
import {
  AllFilterMode,
  DateFilterMode,
  FilterWidgetProps,
  MultiFilterData,
  NumberFilterMode,
  StringFilterMode,
  TypedFilterData,
} from '../types/features/ColumnFilterDef.js';
import { E_CELL_DATA_TYPE } from './CellDataType.js';
import {
  renderDateRange,
  renderMultipleDropdown,
  renderMultipleFilter,
  renderTypedFilter,
} from './FilterType.js';

export interface BuiltinFilterFn<TData extends RowData = unknown>
  extends FilterFn<TData> {
  builtinId: symbol;
}


// date

export const dateRange: BuiltinFilterFn<any> = (
  row,
  columnId: string,
  filterValue: { start: string; end: string }
) => {
  const value = row.getValue<string | null>(columnId);
  if (!value) {
    return false;
  }
  const rowDate = dayjs(value);

  let isAfter: boolean | undefined; // after xx
  let isBefore: boolean | undefined; // before xx
  if (filterValue.start) {
    const start = dayjs(filterValue.start);
    isAfter = rowDate.isAfter(start, 'day');
  }
  if (filterValue.end) {
    const end = dayjs(filterValue.end);
    isBefore = rowDate.isBefore(end, 'day');
  }
  return (isAfter ?? true) && (isBefore ?? true);
};
dateRange.builtinId = Symbol('dateRange');

dateRange.autoRemove = (val: { start: string; end: string }) =>
  testFalsey(val) || (testFalsey(val.start) && testFalsey(val.end));

export const setFilter: BuiltinFilterFn<any> = (
  row,
  columnId: string,
  filterValue: any[]
) => {
  const value = row.getValue<string | null>(columnId);
  let res = false;
  for (let i = 0, len = filterValue.length; i < len; i++) {
    const filterVal = filterValue[i];
    if (filterVal === `${value}`) {
      res = true;
      break;
    }
  }
  return res;
};
setFilter.builtinId = Symbol('setFilter');

setFilter.autoRemove = (val: any) => testFalsey(val) || !val?.length;

// number boolean text date default(text) set
const numberTypeModeOptions = [
  {
    filterFn: setFilter,
    label: 'Set filter',
    filterWidget: renderMultipleDropdown,
  },
];
const booleanTypeModeOptions = [
  {
    filterFn: setFilter,
    label: 'Set filter',
    filterWidget: renderMultipleDropdown,
  },
];
const textTypeModeOptions = [
  {
    filterFn: setFilter,
    label: 'Set filter',
    filterWidget: renderMultipleDropdown,
  },
];
const dateTypeModeOptions = [
  {
    filterFn: dateRange,
    label: 'Between',
    filterWidget: renderDateRange,
  },
];
export const columnFilterModeOptions: Record<
  string,
  {
    filterFn: BuiltinFilterFn<any>;
    label: string;
    filterWidget: (context: FilterWidgetProps) => any;
  }[]
> = {
  number: numberTypeModeOptions, // multiple dropdown
  boolean: booleanTypeModeOptions, // multiple dropdown
  text: textTypeModeOptions, // multiple dropdown
  date: dateTypeModeOptions, // date range
  default: textTypeModeOptions,
};

function testFalsey(val: any) {
  return val === undefined || val === null || val === '';
}



type CompareFn<S, K extends (string & keyof T), T = AllFilterMode, F = TypedFilterData<K, T>> = {
  (
    value: S | null | undefined,
    filter: F
  ): boolean;
  label: string;
}
type CompareMap<S, T = AllFilterMode> = {
  [K in Extract<keyof T, string>]: CompareFn<S, K, T>;
};
type Required2<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

function compareFn<S, K extends string & keyof T, T = AllFilterMode>(
  label: string,
  fn: (value: S | null | undefined, filter: TypedFilterData<K, T>) => boolean
) {
  const func: CompareFn<S, K, T> = (v, f) => fn(v, f);
  func.label = label;
  return func;
}
function compareNonNulls<S, K extends string & keyof T, T = AllFilterMode>(
  label: string,
  fn: (value: NonNullable<S>, filter: Required2<TypedFilterData<K, T>>) => boolean
): CompareFn<S, K, T> {
  return compareFn(label, (value, filter) => {
    if (!isNotEmptyish(filter?.value)) return true;
    if (!isNotEmptyish(value)) return false;
    return fn(value, filter as Required2<TypedFilterData<K, T>>);
  });
}

const filterModes = <Record<E_CELL_DATA_TYPE, CompareMap<unknown>>>{
  [E_CELL_DATA_TYPE.text]: <CompareMap<string, StringFilterMode>>{
    contains: compareNonNulls('Contains', (v, f) =>
      `${v}`.toLocaleLowerCase().includes(`${f.value}`.toLocaleLowerCase())
    ),
    notContains: compareNonNulls(
      'Does not contains',
      (v, f) =>
        !`${v}`.toLocaleLowerCase().includes(`${f.value}`.toLocaleLowerCase())
    ),
    beginsWith: compareNonNulls('Begins with', (v, f) =>
      `${v}`.toLocaleLowerCase().startsWith(`${f.value}`.toLocaleLowerCase())
    ),
    endsWith: compareNonNulls('Ends with', (v, f) =>
      `${v}`.toLocaleLowerCase().endsWith(`${f.value}`.toLocaleLowerCase())
    ),
    equals: compareNonNulls('Equals', (v, f) => f.value === v),
    notEquals: compareFn('Does not equal', (v, f) => f.value !== v),
    empty: compareFn('Empty', (v, f) => !!f.value && isEmptyish(v)),
    notEmpty: compareFn('Not Empty', (v, f) => !!f.value && isNotEmptyish(v)),
  },
  [E_CELL_DATA_TYPE.number]: <CompareMap<number, NumberFilterMode>>{
    equals: compareNonNulls('Equals', (v, f) => f.value === v),
    notEquals: compareFn('Does not equal', (v, f) => f.value !== v),
    greaterThan: compareNonNulls('Greater than', (v, f) => v > f.value),
    greaterThanOrEqual: compareNonNulls(
      'Greater than or equal',
      (v, f) => v >= f.value
    ),
    lessThan: compareNonNulls('Less than', (v, f) => v < f.value),
    lessThanOrEqual: compareNonNulls(
      'Less than or equal',
      (v, f) => v <= f.value
    ),
    between: compareNonNulls(
      'Between',
      (v, { value: { start, end } }) =>
        (!isNotEmptyish(start) || v >= start) &&
        (!isNotEmptyish(end) || v <= end)
    ),
    empty: compareFn('Empty', (v, f) => !!f.value && isEmptyish(v)),
    notEmpty: compareFn('Not Empty', (v, f) => !!f.value && isNotEmptyish(v)),
  },
  [E_CELL_DATA_TYPE.date]: <CompareMap<Date, DateFilterMode>>{
    equals: compareNonNulls('Equals', (v, f) =>
      dayjs(v).isSame(f.value, 'day')
    ),
    notEquals: compareFn(
      'Does not equal',
      (v, f) => isEmptyish(v) || !dayjs(v).isSame(f.value, 'day')
    ),
    before: compareNonNulls('Before', (v, f) =>
      dayjs(v).isBefore(f.value, 'day')
    ),
    after: compareNonNulls('After', (v, f) => dayjs(v).isAfter(f.value, 'day')),
    between: compareNonNulls(
      'Between',
      (v, { value: { start, end } }) =>
        (!isNotEmptyish(start) ||
          dayjs(v).isAfter(dayjs(start).subtract(1, 'day'), 'day')) &&
        (!isNotEmptyish(end) ||
          dayjs(v).isBefore(dayjs(end).add(1, 'day'), 'day'))
    ),
    empty: compareFn('Empty', (v, f) => !!f.value && isEmptyish(v)),
    notEmpty: compareFn('Not Empty', (v, f) => !!f.value && isNotEmptyish(v)),
  },
};

function createFilterFn<
  T = AllFilterMode,
  F extends TypedFilterData<string & keyof T, T> = TypedFilterData<string & keyof T, T>,
  F2 = F,
>(
  key: string,
  compare: (
    value: F['value'],
    filter: F2,
    ...args: Parameters<BuiltinFilterFn>
  ) => boolean,
  autoRemove?: BuiltinFilterFn['autoRemove']
) {
  const fn: BuiltinFilterFn = (row, id, filter, _) =>
    compare(row.getValue(id), filter, row, id, filter, _);
  fn.builtinId = Symbol(key);
  fn.autoRemove = autoRemove ?? (val => isEmptyish(val));
  return fn;
}

const typeFilterer = (type: E_CELL_DATA_TYPE) => {
  const typeFilter: BuiltinFilterFn = createFilterFn(
    `${type}Filter`,
    (value, filter) => {
      const comparatorsForType = filterModes[type];
      const fn = comparatorsForType?.[filter.mode] as CompareFn<
        typeof value,
        typeof filter.mode,
        AllFilterMode
      >;
      return fn?.(value, filter);
    }
  );
  return typeFilter;
};
const multiFilterer = (type: E_CELL_DATA_TYPE) => {
  const typeFilter = typeFilterer(type);
  const multiFilter: BuiltinFilterFn = createFilterFn<
    AllFilterMode,
    TypedFilterData<string & keyof AllFilterMode, AllFilterMode>
    ,(MultiFilterData | string[])[]
  >(`multiFilter_${type}`, (_, filterData, row, colId, __, addMeta) => {
    const filters = row.getColumn(colId)?.columnDef.meta?.filterParams?.filters;
    for (let i = 0; i < filterData.length; i++) {
      const data = filterData[i];
      if (isEmptyish(data)) continue;

      const filterFn = filters?.[i]?.filterFn;
      if (filterFn) {
        if (!filterFn(row, colId, data, addMeta)) return false;
      } else if (Array.isArray(data)) {
        if (data.length && !setFilter(row, colId, data, addMeta)) return false;
      } else if (isMultiFilterData(data) && isFilterData(data.secondary)) {
        if (data.logic === 'or') {
          if (
            (!data.mode || !typeFilter(row, colId, data, addMeta)) &&
            !typeFilter(row, colId, data.secondary, addMeta)
          )
            return false;
        } else {
          if (
            (data.mode && !typeFilter(row, colId, data, addMeta)) ||
            !typeFilter(row, colId, data.secondary, addMeta)
          )
            return false;
        }
      } else if (isFilterData(data)) {
        if (!typeFilter(row, colId, data, addMeta)) return false;
      }
    }
    return true;
  });
  return multiFilter;
};


interface FilterDetail {
  filterFn?: BuiltinFilterFn;
  getFilterFn?: <T extends RowData = unknown>(
    datatype?: E_CELL_DATA_TYPE
  ) => BuiltinFilterFn<T>;
  filterWidget: <T = unknown>(context: FilterWidgetProps<T>) => unknown;
}
const filters = <Record<string, FilterDetail>>{
  // --- backward support
  ['Set filter']: {
    filterFn: setFilter,
    filterWidget: renderMultipleDropdown,
  },
  Between: {
    filterFn: dateRange,
    filterWidget: renderDateRange,
  },
  auto: {
    filterFn: setFilter,
    filterWidget: renderMultipleDropdown,
  },
  // --- new default
  setFilter: {
    filterFn: setFilter,
    filterWidget: renderMultipleDropdown,
  },
  [E_CELL_DATA_TYPE.default]: {
    filterFn: setFilter,
    filterWidget: renderMultipleDropdown,
  },
  // --- typed
  [E_CELL_DATA_TYPE.text]: {
    filterFn: typeFilterer(E_CELL_DATA_TYPE.text),
    filterWidget: renderTypedFilter,
  },
  [E_CELL_DATA_TYPE.number]: {
    filterFn: typeFilterer(E_CELL_DATA_TYPE.number),
    filterWidget: renderTypedFilter,
  },
  [E_CELL_DATA_TYPE.date]: {
    filterFn: typeFilterer(E_CELL_DATA_TYPE.date),
    filterWidget: renderTypedFilter,
  },
  [E_CELL_DATA_TYPE.boolean]: {
    filterFn: setFilter,
    filterWidget: renderMultipleDropdown,
  },
  // --- multiple
  multiple: {
    getFilterFn: datatype =>
      datatype &&
      [
        E_CELL_DATA_TYPE.text,
        E_CELL_DATA_TYPE.number,
        E_CELL_DATA_TYPE.date,
      ].includes(datatype)
        ? multiFilterer(datatype)
        : undefined,
    filterWidget: renderMultipleFilter,
  },
};


export const getFilterFn = <T extends RowData = unknown>(
  filterName: string | E_CELL_DATA_TYPE,
  dataType?: E_CELL_DATA_TYPE
) =>
  filters[filterName]?.filterFn as BuiltinFilterFn<T> ??
  filters[filterName]?.getFilterFn<T>?.(dataType);

export const getFilterWidget = (filterName: string | E_CELL_DATA_TYPE) =>
  filters[filterName]?.filterWidget ?? renderMultipleDropdown;

export const getFilterModes = (filterName: string) =>
  Object.entries(filterModes[filterName as E_CELL_DATA_TYPE] ?? {}).map(
    ([value, { label }]) => ({
      label,
      value,
    })
  );

export function isFilterData<K extends string & keyof T, T = AllFilterMode>(
  data: unknown
): data is TypedFilterData<K, T> {
  if (getTag(data) === objectTag) {
    const obj = data as object;
    return obj.hasOwnProperty('mode') || obj.hasOwnProperty('value');
  }
  return false;
}
export function isMultiFilterData(data: unknown): data is MultiFilterData {
  if (isFilterData(data))
    return data.hasOwnProperty('secondary');
  return false;
}