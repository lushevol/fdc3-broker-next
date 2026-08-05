import { html } from 'lit';
import { ref } from 'lit/directives/ref.js';
import '../../../../elements/sc-date-picker.js';
import '../../../../elements/sc-text-input.js';
import { ScDataGridColumnSetFilter } from '../ScDataGridColumnSetFilter.js';
import '../ScDataGridColumnTypedFilter.js';
import '../ScDataGridColumnMultipleFilter.js';
import { AllFilterMode, TypedFilterData, FilterWidgetProps } from '../types/features/ColumnFilterDef.js';


function collectFilterWidget(context: FilterWidgetProps) {
  return (el?: Element) => (context.column._filterWidgetCache ??= el);
}
export function renderMultipleDropdown(context: FilterWidgetProps) {
  const isEnabledFilterMultipleRows = context?.table?.options?.filterMultipleRows ?? false;
  const cacheEl = context.column._filterWidgetCache as
    | ScDataGridColumnSetFilter
    | undefined;
  if (cacheEl) {
    cacheEl.column = context.column;
    cacheEl.value = context.value as string[];
    cacheEl.bindFilterValue = context.bindFilterValue;
    cacheEl.filterMultipleRows = isEnabledFilterMultipleRows;
    return cacheEl;
  }
  return html`<sc-data-grid-column-set-filter
    .column=${context.column}
    ?filter-multiple-rows=${isEnabledFilterMultipleRows}
    .value=${context.value as string[]}
    .bindFilterValue=${context.bindFilterValue}
    ${ref(collectFilterWidget(context))}
  >
  </sc-data-grid-column-set-filter>`;
}
export function renderDateRange(context: FilterWidgetProps & { value: any }) {
  return html`<sc-date-range-input
    clearable
    @sc-change=${(e: CustomEvent) => {
      context.bindFilterValue(e.detail.value);
      e.stopPropagation();
    }}
    @sc-clear=${(e: CustomEvent) => {
      context.bindFilterValue('');
    }}
    .value=${context.value}
    border-type="box"
    size="md"
  >
  </sc-date-range-input>`;
}


export function renderTypedFilter<
  T extends TypedFilterData<keyof AllFilterMode, AllFilterMode> = TypedFilterData<
    keyof AllFilterMode,
    AllFilterMode
  >
>(props: FilterWidgetProps<T>) {
  return html`
    <sc-data-grid-column-typed-filter
      .data=${props.value}
      .columnType=${props.column.getColumnFilterType()}
      .filterDef=${props.filterDef}
      .bindFilterValue=${props.bindFilterValue}
    ></sc-data-grid-column-typed-filter>
  `;
}

export function renderMultipleFilter<
  T extends TypedFilterData<keyof AllFilterMode, AllFilterMode> = TypedFilterData<
    keyof AllFilterMode,
    AllFilterMode
  >
>(props: FilterWidgetProps<T>) {
  return html`
    <sc-data-grid-column-multiple-filter
      .data=${props.value ?? []}
      .columnType=${props.column.getColumnFilterType()}
      .filterDef=${props.filterDef}
      .column=${props.column}
      .table=${props.table}
      .bindFilterValue=${props.bindFilterValue}
    ></sc-data-grid-column-multiple-filter>
  `;
}
