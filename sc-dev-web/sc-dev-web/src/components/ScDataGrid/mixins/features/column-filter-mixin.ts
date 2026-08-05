import { TConstructor, safeMixin } from '../../../../shared/mixin.js';
import { TableStateMixin } from '../table-state-mixin.js';
import { watch } from '../../../../shared/watch.js';
import { Feature } from '../../types/Feature.js';
import {
  Column,
  Row,
  Table,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
} from '@tanstack/lit-table';
import { storybook } from '../../../../shared/storybook.decorators.js';
import { property, query, queryAsync, state } from 'lit/decorators.js';
import type { ScDataGridColumnFilter } from '../../ScDataGridColumnFilter.js';
import { debounce } from '../../../../shared/debounce.js';
import {
  ColumnFilterLookupDefinitions,
  ColumnFilterModes,
  ColumnFilterType,
  ColumnFilterWidgets,
} from '../../custom-features/column-type.js';
import {
  BuiltinFilterFn,
  columnFilterModeOptions,
} from '../../widgets/FilterModes.js';
import ScElement from '../../../../shared/sc-element.js';
import { ScDataGridCompositeFilter } from '../../ScDataGridCompositeFilter.js';
import { ERowPosition } from '../../types/utils.js';
import { MasterRowMixin } from '../master-row.mixin.js';
import { RowHeightObserverMixin } from '../row-height-observer-mixin.js';
import { isNotEmptyish } from '../../../../shared/util.js';

type FilterToggle = {
  type: 'mousedown' | 'mouseup';
  target: HTMLDivElement;
};
export type TMixin = {
  columnFilterEl: Promise<ScDataGridColumnFilter>;
  toggleColumnFilter(
    e: CustomEvent<FilterToggle>,
    column: Column<unknown, unknown>,
    table: Table<unknown>
  ): void;
  emitExternalScFilterEvent(): void;
  handleGlobalFilter(
    e: CustomEvent<{
      value: string;
    }>
  ): void;

  getColumnFilterOptions(): Record<string, any>;
  advancedFilter: boolean | string;
  filterMultipleRows: boolean;
  filterable: boolean;
  manualFilter: boolean;
  getHasColumnFilter(): boolean;
  getHasAdvancedFilter(): boolean | string;
  getHasSearchFilter(): boolean | string;
  isCompositeFilterActive: boolean;
  toggleCompositeFilter: (value?: boolean) => void;
};

// ANA: some property or methods might need to hoist to table instance level.
// ANA: otherwise we need to extends from each other. it is easy to cause circular dependency.
export const ColumnFilterMixin = safeMixin(
  <T extends TConstructor<ScElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin
      extends MasterRowMixin(
        RowHeightObserverMixin(TableStateMixin(superClass))
      )
      implements Feature<'columnFilter'>
    {
      @queryAsync('sc-data-grid-column-filter')
      columnFilterEl: Promise<ScDataGridColumnFilter>;

      @storybook('boolean', {
        description: 'Set to enable multiple rows for filter dropdown',
        defaultValue: false,
      })
      @property({
        type: Boolean,
        attribute: 'filter-multiple-rows',
        reflect: true,
      })
      filterMultipleRows = false;

      @storybook('inline-radio', {
        description: `Set to toggle advanced filter. If set as true, all columns including hidden are matched. 
          Set to "exclude-hidden" to exclude hidden columns.`,
        defaultValue: false,
        options: [false, true, 'exclude-hidden'],
      })
      @property({
        attribute: 'advanced-filter',
        reflect: true,
        converter: {
          fromAttribute: s =>
            typeof s === 'string' && s.trim().length ? s : s !== null,
          toAttribute: v =>
            v ? (typeof v === 'string' && v.trim().length ? v : window.trustedTypes?.emptyScript ?? '') : null,
        },
      })
      advancedFilter: boolean | string = false;

      @storybook('boolean', {
        description: 'Set to toggle column filter',
        defaultValue: false,
      })
      @property({ type: Boolean, reflect: true })
      filterable = false;

      @storybook('boolean', {
        description:
          'Set to enable manual filtering for the data grid, Listen sc-filter to update grid data if true',
        defaultValue: false,
      })
      @property({ type: Boolean, attribute: 'manual-filter', reflect: true })
      manualFilter = false;

      @query('sc-data-grid-composite-filter')
      compositeFilter: ScDataGridCompositeFilter;

      @state()
      isCompositeFilterActive = false;

      toggleCompositeFilter = (value?: boolean) => {
        const isOpen = value ?? true;
        if (isOpen) {
          this.isCompositeFilterActive = true;
        } else {
          this.isCompositeFilterActive = false;
        }
      };

      @watch('manualFilter')
      handleManualFilterChange() {
        this.table.setOptions(prev => {
          return {
            ...prev,
            manualFiltering: this.manualFilter,
          };
        });
      }
      @watch('filterMultipleRows')
      handleFilterMultipleRows() {
        this.table.setOptions(prev => {
          return {
            ...prev,
            filterMultipleRows: this.filterMultipleRows,
          };
        });
      }
      getHasColumnFilter() {
        return this.table
          .getVisibleFlatColumns()
          .some(column => column.getCanFilter());
      }
      getHasAdvancedFilter() {
        return this.getHasColumnFilter() && this.advancedFilter;
      }
      getHasSearchFilter() {
        return this.filterable && this.advancedFilter;
      }
      @watch(['advancedFilter', 'filterable'])
      handleAdvancedFilter() {
        if (!this.getHasSearchFilter()) {
          this.table.resetGlobalFilter();
        }
      }

      @watch('filterable')
      onColumnFilterableChange() {
        this.table.setOptions(prev => {
          return {
            ...prev,
            columns: [...prev.columns], // for reference
            defaultColumn: {
              ...prev.defaultColumn,
              enableColumnFilter: this.filterable,
            },
          };
        });
      }

      @watch('columns')
      updateColumnFilter() {
        const columnFilterType: ColumnFilterType = new Map();
        const columnFilterLookupDefinitions: ColumnFilterLookupDefinitions =
          new Map();
        const columnFilterWidgets: ColumnFilterWidgets = new Map();
        const columns = this.table.getAllFlatColumns();
        columns.forEach(column => {
          const filterType = column.columnDef.meta?.filterType;
          const filterLookup = column.columnDef.meta?.filterLookup;
          const filterWidget = column.columnDef.meta?.filterWidget;
          if (filterType) {
            const cellDataType = column.getCellDataType();
            if (filterType !== cellDataType) {
              console.warn(
                `You are trying set different filter type: ${filterType}, but cell data type is: ${cellDataType}.
                It might cause unexpected trouble.`
              );
            }
            columnFilterType.set(column.id, filterType);
          }
          if (filterLookup) {
            columnFilterLookupDefinitions.set(column.id, filterLookup);
          }
          if (filterWidget) {
            columnFilterWidgets.set(column.id, filterWidget);
          }
        });
        this.table.setColumnFilterType(columnFilterType);
        this.table.setColumnFilterLookupDefinitions(
          columnFilterLookupDefinitions
        );
        this.table.setColumnFilterWidgets(columnFilterWidgets);
      }

      getColumnFilterOptions() {
        const filterFns: Record<string | symbol, BuiltinFilterFn<any>> = {};
        Object.values(columnFilterModeOptions).forEach(options => {
          options.forEach(option => {
            const filterFnKey = option.filterFn.builtinId ?? option.label;
            filterFns[filterFnKey] = option.filterFn;
          });
        });
        return {
          getFilteredRowModel: getFilteredRowModel(),
          getFacetedRowModel: getFacetedRowModel(),
          getFacetedUniqueValues: getFacetedUniqueValues(),
          globalFilterFn: this._globalFilterFn,
          getColumnCanGlobalFilter: this._getColumnCanGlobalFilter,
          filterFns,
        };
      }

      handleGlobalFilter = debounce((e: CustomEvent<{ value: string }>) => {
        const keyword = e.detail.value;
        if (keyword) {
          this.table.setGlobalFilter(keyword);
        } else {
          this.table.resetGlobalFilter();
        }
        this.emitExternalScFilterEvent();
      }, 500);

      private _globalFilterFn = (
        row: Row<Record<PropertyKey, unknown>>,
        colId: string,
        filterValue: string
      ) => {
        const filter = filterValue.toLowerCase();
        const value = row.original[colId];

        const col = row.getColumn(colId);
        const cell = row.getCell(`${row.id}_${colId}`);
        if (
          cell?.getIsDefaultCellRenderer() === false ||
          col?.getCellDataType() === 'date'
        ) {
          const text = cell?.getRenderedTextContent();
          if (text)
            return text.toLowerCase().includes(filter);
        }

        if (isNotEmptyish(value) && `${value}`.toLowerCase().includes(filter))
          return true;

        return false;
      };
      private _getColumnCanGlobalFilter = (
        column: Column<unknown, unknown>
      ) => {
        const cell = this.table
          .getCoreRowModel()
          .flatRows[0]?._getAllCellsByColumnId()[column.id];
        const value = cell?.getValue();

        return (
          (cell.column.getIsVisible() ||
          !String(this.advancedFilter)
            .split(';')
            .includes('exclude-hidden')) &&
          (typeof value === 'string' ||
            typeof value === 'number' ||
            value instanceof Date ||
            !cell.getIsDefaultCellRenderer())
        );
      };

      emitExternalScFilterEvent() {
        // reset page index only if not manual pagination, else it is user controlled
        if (!this.table.options.manualPagination) {
          this.table.setPageIndex(0);
        }
        
        this.updatePrefixSum(ERowPosition.center);
        this.updatePrefixSum(ERowPosition.top);
        this.updatePrefixSum(ERowPosition.bottom);
        this.updatePrefixSum(ERowPosition.header);
        this.updateMasterRowPrefixSum();
        this.table.updateRowSpanning();
        this.emit('sc-filter', {
          detail: {
            columnFilterValues: this.table.getState().columnFilters,
            globalFilterValue: this.table.getState().globalFilter,
          },
        });
      }

      async toggleColumnFilter(
        e: CustomEvent<FilterToggle>,
        column: Column<unknown, unknown>,
        table: Table<unknown>
      ) {
        const columnFilterEl = await this.columnFilterEl;
        const type = e.detail.type;
        if (type === 'mousedown') {
          columnFilterEl.column = undefined as any;
          columnFilterEl.hidePopup();
        } else if (type === 'mouseup') {
          const headerCell = e.detail.target;

          columnFilterEl.column = column;
          columnFilterEl.table = table;
          columnFilterEl.setVirtualAnchor(headerCell);
          columnFilterEl.showPopup();
        }
      }
    }
    return Mixin;
  }
);
