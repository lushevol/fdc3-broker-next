import {
  Cell,
  CellContext,
  Column,
  Header,
  OnChangeFn,
  Row,
  RowData,
  Table,
  TableFeature,
  Updater,
  flexRender,
  makeStateUpdater,
  sortingFns,
} from '@tanstack/lit-table';
import dayjs from 'dayjs/esm/index.js';
import { TemplateResult, nothing, render } from 'lit';
import { getTag } from '../../../shared/isEuqalWith/getTag.js';
import {
  booleanTag,
  dateTag,
  numberTag,
  stringTag,
} from '../../../shared/isEuqalWith/tags.js';
import { memo } from '../../../shared/memo.js';
import { isEmptyish, isNotEmptyish } from '../../../shared/util.js';
import {
  FilterLookup,
  FilterWidget,
  FilterWidgetProps,
} from '../types/features/ColumnFilterDef.js';
import {
  E_CELL_DATA_TYPE,
  defaultCellDataTypeDefinitions,
  defaultCellEditingDefinitions,
} from '../widgets/CellDataType.js';
import {
  BuiltinFilterFn,
  getFilterFn,
  getFilterWidget,
} from '../widgets/FilterModes.js';

// All columns has their own type for display cell and filter part

export type ColumnFilterModes = Map<string, string[]>;
export type ColumnFilterType = Map<string, string>;
export type ColumnFilterMode = Map<string, string>;
export type ColumnFilterLookupDefinitions = Map<string, FilterLookup>;
export type ColumnFilterWidgets = Map<string, FilterWidget>;

export interface ColumnTypeTableState {
  columnFilterWidgets: ColumnFilterWidgets;
  columnFilterLookupDefinitions: ColumnFilterLookupDefinitions;
  /**
   * specified column filter type user defined, should be fit with cell date type
   * normally do not need set, but if user want to use set filter for a column, set it
   */
  columnFilterType: ColumnFilterType;
}
export type CellDataTypeDefinitions = Record<
  string,
  (props: CellContext<unknown, unknown>) => any
>;

export interface ColumnTypeOptions {
  onColumnFilterLookupDefinitionsChange?: OnChangeFn<ColumnFilterLookupDefinitions>;
  onColumnFilterWidgetsChange?: OnChangeFn<ColumnFilterWidgets>;
  onColumnFilterTypeChange?: OnChangeFn<ColumnFilterType>;
  cellDataTypeDefinitions: CellDataTypeDefinitions;
}
export interface ColumnTypeInstance {
  getCellDataType: (value: unknown) => E_CELL_DATA_TYPE;
  setColumnFilterLookupDefinitions: (
    updater: Updater<ColumnFilterLookupDefinitions>
  ) => void;
  setColumnFilterWidgets: (updater: Updater<ColumnFilterWidgets>) => void;
  setColumnFilterType: (updater: Updater<ColumnFilterType>) => void;
}

export interface ColumnTypeHeader {
  render: () => TemplateResult | string | typeof nothing;
  getRenderedTextContent: () => string;
}
export interface ColumnTypeColumn<TData extends RowData, TValue> {
  getCellDataType: () => E_CELL_DATA_TYPE;
  getColumnFilterType: () => E_CELL_DATA_TYPE;
  /** @deprecated */
  getFilterFnKeyViaLabel: (label: string) => symbol | string | undefined;
  getValues: () => unknown[];
  getLookupDefinition: () => FilterLookup | undefined;
  getFilterLookup: () => ((keyword?: string) => Promise<any>) | undefined;
  getStaticFilterData: () => { label: string; value: unknown }[] | undefined;
  convertSetFilterData: (values: unknown[]) => { label: string; value: string }[];

  getFilterWidget: () => ((context: FilterWidgetProps) => any) | undefined;
  /** Original implementation of [getFilterFn] */
  _getFilterFn: Column<TData, TValue>['getFilterFn'];
  _filterWidgetCache?: Element;
  /** Original implementation of [accessorFn] */
  _accessorFn?: (originalRow: TData, index: number) => TValue;
}
export interface ColumnTypeCell<TData extends RowData> {
  getRenderFnBaseonType: () =>
    | ((props: CellContext<TData, unknown>) => string)
    | string | TemplateResult | undefined;
  getRenderableComponentForEditor: () => (
    props: CellContext<unknown, unknown>,
    sendValue: (updatedVal: any) => void
  ) => any;
  getIsDefaultCellRenderer: () => boolean;
  render: () => TemplateResult | string | typeof nothing;
  getRenderedTextContent: () => string;
}

export const ColumnTypeFeature: TableFeature<any> = {
  getInitialState: (state): ColumnTypeTableState => {
    return {
      columnFilterWidgets: new Map(),
      columnFilterLookupDefinitions: new Map(),
      columnFilterType: new Map(),
      ...state,
    };
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): ColumnTypeOptions => {
    return {
      onColumnFilterLookupDefinitionsChange: makeStateUpdater(
        'columnFilterLookupDefinitions',
        table
      ),
      onColumnFilterWidgetsChange: makeStateUpdater(
        'columnFilterWidgets',
        table
      ),
      onColumnFilterTypeChange: makeStateUpdater('columnFilterType', table),
      cellDataTypeDefinitions: {},
    } as ColumnTypeOptions;
  },
  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setColumnFilterLookupDefinitions = updater =>
      table.options.onColumnFilterLookupDefinitionsChange?.(updater);
    table.setColumnFilterWidgets = updater =>
      table.options.onColumnFilterWidgetsChange?.(updater);
    table.setColumnFilterType = updater =>
      table.options.onColumnFilterTypeChange?.(updater);

    table.getCellDataType = (value: unknown) => {
      switch (getTag(value)) {
        case stringTag:
          return E_CELL_DATA_TYPE.text;
        case numberTag:
          return E_CELL_DATA_TYPE.number;
        case booleanTag:
          return E_CELL_DATA_TYPE.boolean;
        case dateTag:
          return E_CELL_DATA_TYPE.date;
        default:
          return E_CELL_DATA_TYPE.default;
      }
    };
  },
  createHeader: <TData extends RowData>(
    header: Header<TData, unknown>
  ): void => {
    header.render = memo(
      () => [header.isPlaceholder, header.column.columnDef.header],
      (isPlaceholder, headerDef) =>
        isPlaceholder
          ? ''
          : flexRender(headerDef, header.getContext()) ?? nothing
    );
    header.getRenderedTextContent = memo(
      () => [header.render()],
      template => {
        if (typeof template === 'string') {
          return template;
        }
        if (template instanceof Node) {
          return template.textContent?.trim() || '';
        }
        const div = document.createElement('div');
        render(template, div);
        return div.textContent?.trim() || '';
      }
    );
  },
  createColumn: <TData extends RowData, TValue>(
    column: Column<TData, TValue>,
    table: Table<TData>
  ): void => {
    column.getLookupDefinition = memo(
      () => [table.getState().columnFilterLookupDefinitions],
      columnFilterLookupDefinitions => {
        return columnFilterLookupDefinitions.get(column.id);
      }
    );
    column.getValues = memo(
      () => [table.getCoreRowModel().flatRows, column.accessorFn],
      rows => {
        return Array.from(
          new Set(
            rows.map(row => {
              return row.getValue(column.id);
            })
          )
        );
      }
    );
    column.getFilterFnKeyViaLabel = memo(
      label => [label, column.getColumnFilterType()],
      (label, columnFilterType) => {
        return getFilterFn(label ?? columnFilterType, columnFilterType)
          ?.builtinId;
      }
    );
    column.getFilterWidget = memo(
      () => [
        column.columnDef.meta?.filterWidget,
        column.columnDef.meta?.filter,
        column.getColumnFilterType(),
      ],
      (filterWidget, _, columnFilterType) => {
        // initializing call to memo
        column.getFilterFn();
        // meta.filter can change in getFilterFn
        return (
          filterWidget ??
          getFilterWidget(column.columnDef.meta?.filter ?? columnFilterType)
        );
      }
    );
    column._getFilterFn = column.getFilterFn;
    column.getFilterFn = memo(
      () => [column.getColumnFilterType(), column.columnDef.meta?.filter],
      (columnFilterType, _) => {
        if (typeof column.columnDef.filterFn === 'function')
          return column.columnDef.filterFn;

        let filterFn: BuiltinFilterFn<TData> | undefined;
        let filterName: string | E_CELL_DATA_TYPE = columnFilterType;
        if (column.columnDef.meta?.filter) {
          filterFn = getFilterFn(
            column.columnDef.meta.filter,
            columnFilterType
          );
          if (!filterFn) {
            console.warn(
              `Filter '${column.columnDef.meta.filter}' not supported for ` +
                `${columnFilterType} column '${column.id}'. Will use 'setFilter' as default`
            );
            column.columnDef.meta.filter = 'setFilter';
            filterFn = getFilterFn('setFilter');
          }
          filterName = column.columnDef.meta.filter;
        } else if (column.columnDef.filterFn === 'auto') {
          filterName = E_CELL_DATA_TYPE.default;
          column.columnDef.meta = {
            ...column.columnDef.meta,
            filter: filterName,
          };
          filterFn = getFilterFn(filterName);
        }
        // fallback
        return (
          (filterFn as BuiltinFilterFn<TData>) ??
          getFilterFn<TData>('setFilter')
        );
      }
    );

    /// this is an override
    column.getAutoSortingFn = memo(
      () => [column.getCellDataType()],
      cellDataType => {
        switch (cellDataType) {
          case E_CELL_DATA_TYPE.text:
            return sortingFns.text;
          case E_CELL_DATA_TYPE.date:
            return sortingFns.datetime;
          case E_CELL_DATA_TYPE.boolean:
          case E_CELL_DATA_TYPE.number:
          default:
            return sortingFns.basic;
        }
      }
    );

    /**
     * for set filter - dynamic
     * @returns (keywors?: string) => promise<any>
     */
    column.getFilterLookup = memo(
      () => [column.getLookupDefinition()],
      filterLookup =>
        filterLookup
          ? (keyword?: string) => filterLookup({ keyword, column, table })
          : undefined
    );

    /**
     * for set filter - static
     * @returns dropdown data
     */
    column.getStaticFilterData = memo(
      () => [column.getFacetedUniqueValues()],
      facetedUniqueValues => {
        const dropdownData = Array.from(
          (facetedUniqueValues || new Map()).keys()
        );
        return column.convertSetFilterData(dropdownData);
      }
    );

    column.convertSetFilterData = (values: unknown[]) =>
      smartSort(values).map(value => ({
        value: `${value}`,
        label: getLabel(column.getColumnFilterType(), value),
      }));

    column.getColumnFilterType = memo(
      () => [column.columnDef.meta?.filterType, column.getCellDataType()],
      (filterType, cellDataType) =>
        (filterType as E_CELL_DATA_TYPE) ?? cellDataType
    );
    column.getCellDataType = memo(
      () => [table.options.data],
      () => {
        let cellDataType = column.columnDef.meta?.cellDataType as
          | E_CELL_DATA_TYPE
          | undefined;
        if (!cellDataType && column._accessorFn) {
          for (let i = 0, len = table.options.data.length; i < len; ++i) {
            const originalData = table.options.data[i];
            const value = column._accessorFn(originalData, i);
            if (isNotEmptyish(value)) {
              cellDataType = table.getCellDataType(value);
              column.columnDef.meta = {
                ...column.columnDef.meta,
                cellDataType,
              };
              break;
            }
          }
        }

        return cellDataType ?? E_CELL_DATA_TYPE.default;
      }
    );

    column._accessorFn = column.accessorFn;
    column.accessorFn = (originalRow: TData, index: number) => {
      if (!column._accessorFn) return undefined as TValue;
      const value = column._accessorFn(originalRow, index);
      const filterType = column.getCellDataType();
      return convertEmptyish(value, filterType) as TValue;
    };
  },
  createCell: <TData extends RowData, TValue>(
    cell: Cell<TData, TValue>,
    column: Column<TData, TValue>,
    row: Row<TData>,
    table: Table<TData>
  ): void => {
    cell.getIsDefaultCellRenderer = memo(
      () => [cell.column.columnDef, table._getDefaultColumnDef()],
      (customizedColumnDef, defaultColumnDef) => {
        return customizedColumnDef.cell === defaultColumnDef.cell;
      }
    );
    cell.getRenderFnBaseonType = memo(
      () => [cell.getIsDefaultCellRenderer(), column.getCellDataType()],
      (isDefaultCellRenderer, cellDataType) => {
        if (isDefaultCellRenderer) {
          const type = cellDataType;
          const cellDateTypeDefinitions = {
            ...defaultCellDataTypeDefinitions,
            ...table.options.cellDataTypeDefinitions,
          };
          const renderFn = cellDateTypeDefinitions[type];
          return renderFn;
        } else {
          return cell.column.columnDef.cell as any;
        }
      }
    );
    cell.getRenderableComponentForEditor = memo(
      () => [cell.getIsEditable(), column.getCellDataType()],
      (isEditable, cellDataType) => {
        if (!isEditable) {
          return () => {};
        }
        const type = cellDataType;
        const cellDateTypeDefinitions = {
          ...defaultCellEditingDefinitions,
        };
        const renderFn = cellDateTypeDefinitions[type];
        return renderFn;
      }
    );
    cell.render = memo(
      () => {
        const { isAggregated } = cell.getUIState();
        return [isAggregated, cell.getContext(), cell.getRenderFnBaseonType()];
      },
      (isAggregated, context, renderFn) => {
        let renderContent: TemplateResult | string | undefined | null;
        if (isAggregated) {
          if (
            cell.column.columnDef.aggregatedCell !==
            table._getDefaultColumnDef().aggregatedCell
          ) {
            renderContent = flexRender(
              cell.column.columnDef.aggregatedCell,
              cell.getContext()
            );
          }
          return renderContent ?? nothing;
        }
        if (renderFn instanceof Function) {
          renderContent = renderFn(context);
        } else {
          renderContent = renderFn;
        }
        return renderContent ?? nothing;
      }
    );
    cell.getRenderedTextContent = memo(
      () => [cell.render()],
      template => {
        if (typeof template === 'string') {
          return template;
        }
        if (template instanceof Node) {
          return template.textContent?.trim() || '';
        }
        const div = document.createElement('div');
        render(template, div);
        return div.textContent?.trim() || '';
      }
    );
  },
};

function convertEmptyish<T>(
  value: T | undefined | null,
  filterType: string
): T | null {
  if (isNotEmptyish(value)) return value;
  switch (filterType) {
    case E_CELL_DATA_TYPE.boolean:
      return false as T;
    case E_CELL_DATA_TYPE.text:
    case E_CELL_DATA_TYPE.default:
    case E_CELL_DATA_TYPE.number:
    case E_CELL_DATA_TYPE.date:
    default:
      return null;
  }
}

function getLabel(filterType: string, value: any) {
  if (filterType === E_CELL_DATA_TYPE.boolean)
    return value ? 'Active' : 'Inactive';
  if (isEmptyish(value)) return '(empty)';
  if (filterType === E_CELL_DATA_TYPE.date)
    return dayjs(value).format('DD MMM YYYY');
  return `${value}`;
}

export function detectArrayType(arr: unknown[]) {
  const firstItem = arr[0];
  if (typeof firstItem === 'number') {
    return 'number';
  }
  if (
    typeof firstItem === 'string' &&
    !isNaN(Number(firstItem)) &&
    firstItem.trim() !== ''
  ) {
    return 'numeric-string';
  }
  return 'non-numberic-string';
}

export function smartSort(arr: unknown[]) {
  const arrayType = detectArrayType(arr);
  switch (arrayType) {
    case 'number':
      return arr.sort((a, b) => {
        if (isEmptyish(a)) return -1;
        if (isEmptyish(b)) return 1;
        return Number(a) - Number(b);
      });
    case 'numeric-string':
      return arr.sort((a, b) => {
        return Number(a) - Number(b);
      });
    case 'non-numberic-string':
      return arr.sort((a, b) => {
        if (isEmptyish(a)) return -1;
        if (isEmptyish(b)) return 1;
        return String(a).localeCompare(String(b));
      });
  }
}
