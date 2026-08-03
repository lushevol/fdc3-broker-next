import { Column, Table } from '@tanstack/lit-table';
import { css, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import '../../../elements/sc-radio-group.js';
import '../../../elements/sc-radio.js';
import ScElement from '../../shared/sc-element.js';
import { isNotEmptyish } from '../../shared/util.js';
import { watch } from '../../shared/watch.js';
import ScTheme from '../../styles/ScTheme.js';
import {
  AnyFilterData,
  BindFilterValue,
  FilterDef,
  MultiFilterData,
  MultiFilters,
} from './types/features/ColumnFilterDef.js';
import { E_CELL_DATA_TYPE } from './widgets/CellDataType.js';
import { getFilterFn, getFilterWidget } from './widgets/FilterModes.js';



export class ScDataGridColumnMultiFilter extends ScElement {
  static styles = ScTheme.getStyles().concat([
    css`
      .container {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 0.5rem;

        .section {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 0.5rem;

          & + & {
            /* border-top: 1px solid var(--sc-divider-color); */
            padding-top: 0.625rem;
          }
        }
      }
      .radio-wrap {
        display: flex;
        justify-content: center;
      }
    `,
  ]);

  @property({ attribute: false }) column: Column<unknown>;
  @property({ attribute: false }) table: Table<unknown>;
  @property({ attribute: false }) columnType: E_CELL_DATA_TYPE;
  @property({ attribute: false }) data?: MultiFilters;
  @property({ attribute: false }) filterDef?: FilterDef;
  @property({ attribute: false }) bindFilterValue: BindFilterValue<
    MultiFilters | undefined
  >;

  private _filterData: MultiFilters = [];
  private _subFiltersDefs: FilterDef[];
  private _iterations = 0;

  get columnFilters() {
    this._subFiltersDefs = ((this.filterDef ??= {}).filterParams ??=
      {}).filters ??= [
      E_CELL_DATA_TYPE.text,
      E_CELL_DATA_TYPE.number,
      E_CELL_DATA_TYPE.date,
    ].includes(this.columnType)
      ? [{ filter: this.columnType }, { filter: 'setFilter' }]
      : [{ filter: 'setFilter' }];
    return this._subFiltersDefs;
  }

  get _staticDataGetter() {
    const rows = this.column.getFacetedRowModel().rows;
    const fn = getFilterFn('multiple', this.columnType);

    // exclude setFilter data
    const data = this._filterData.filter(
      v => !Array.isArray(v) && isNotEmptyish(v)
    );
    const values = (
      data.length && fn
        ? rows.filter(row => fn(row, this.column.id, data, () => void 0))
        : rows
    ).map(row => row.getValue(this.column.id));
    const results = this.column.convertSetFilterData(
      values.filter((v, i) => values.indexOf(v) === i)
    );
    return () => results;
  }

  @watch('data')
  onDataChange() {
    this._filterData = this.data?.concat() ?? [];
  }

  _processData(index: number, value: AnyFilterData) {
    this._filterData[index] = value;
    const filterName = this.columnFilters[index]?.filter;
    if (
      value &&
      filterName &&
      [
        E_CELL_DATA_TYPE.text,
        E_CELL_DATA_TYPE.number,
        E_CELL_DATA_TYPE.date,
      ].includes(filterName as E_CELL_DATA_TYPE)
    ) {
      const data = value as MultiFilterData;
      if (!data.mode || !data.value) {
        if (!data.secondary) this._filterData[index] = undefined;
      }
      if (data.secondary && !data.logic) data.logic = 'and';
    }
    if (filterName !== 'setFilter') {
      this._iterations++; // force rerender setFilter
      // this fixes exception thrown from sc-dropdown-input
      requestIdleCallback(() =>this.requestUpdate());
    }

    this.bindFilterValue(this._filterData.filter(v => isNotEmptyish(v)).length > 0
        ? this._filterData.concat()
        : undefined);
  }

  render() {
    return html`<div class="container">
      ${repeat(
        this.columnFilters,
        (filterDef, i) =>
          filterDef.filter === 'setFilter'
            ? `${i}setFilter${this._iterations}`
            : i,
        (filterDef, index) => {
          if (filterDef.filterWidget) {
            return html`<div class="section">
              ${filterDef.filterWidget({
                value: this._filterData[index] as string[],
                bindFilterValue: value => this._processData(index, value),
                table: this.table,
                column: this.column,
                filterDef,
              })}
            </div>`;
          }
          const filterWidget = filterDef.filter
            ? getFilterWidget(filterDef.filter)
            : undefined;
          if (filterDef.filter === 'setFilter' || !filterWidget) {
            filterDef.filter = 'setFilter';
            return html`<div class="section">
              <sc-data-grid-column-set-filter
                .column=${this.column}
                .value=${this._filterData[index] as string[]}
                .bindFilterValue=${(value: string[]) =>
                  this._processData(index, value?.length ? value : undefined)}
                .table=${this.table}
                .staticData=${this._staticDataGetter}
              ></sc-data-grid-column-set-filter>
            </div>`;
          }

          const data = (this._filterData[index] ??= {}) as MultiFilterData;
          const props = {
            table: this.table,
            column: this.column,
            filterDef,
          };
          return html`<div class="section">
            ${filterWidget({
              value: data,
              bindFilterValue: res =>
                this._processData(index, {
                  ...data,
                  mode: res?.mode,
                  value: res?.value,
                }),
              ...props,
            })}
            ${data && !Array.isArray(data) && (data.value || data.secondary)
              ? html`<div class="radio-wrap">
                    <sc-radio-group
                      .value=${data.logic ?? 'and'}
                      @sc-change=${(e: CustomEvent<{ value: 'or' | 'and' }>) =>
                        this._processData(index, {
                          ...data,
                          logic: e.detail.value,
                        })}
                      direction="horizontal"
                    >
                      <sc-radio value="and">And</sc-radio>
                      <sc-radio value="or">Or</sc-radio>
                    </sc-radio-group>
                  </div>

                  ${filterWidget({
                    value: data.secondary,
                    bindFilterValue: secondary =>
                      this._processData(index, { ...data, secondary }),
                    ...props,
                  })}`
              : nothing}
          </div>`;
        }
      )}
    </div>`;
  }
}

if (!customElements.get('sc-data-grid-column-multiple-filter')) customElements.define('sc-data-grid-column-multiple-filter', ScDataGridColumnMultiFilter);
