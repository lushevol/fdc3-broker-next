import { Column } from '@tanstack/lit-table';
import { html } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { getTag } from '../../shared/isEuqalWith/getTag.js';
import { arrayTag } from '../../shared/isEuqalWith/tags.js';
import ScElement from '../../shared/sc-element.js';

import { ScDropdownMultiSelect } from '../../../elements/sc-dropdown-input.js';
import { BindFilterValue } from './types/features/ColumnFilterDef.js';

export class ScDataGridColumnSetFilter extends ScElement {
  @property({ type: Object })
  column: Column<unknown>;

  @property({ type: Object })
  bindFilterValue: BindFilterValue<string[]>;

  @property({ type: Array })
  value?: string[];

  @property({ attribute: false })
  staticData?: () => { label: string; value: unknown }[];

  @property({
    type: Boolean,
    attribute: 'filter-multiple-rows',
    reflect: true,
  })
  filterMultipleRows = false;

  @state()
  data: {
    label: string;
    value: unknown;
  }[] = [];

  selectedData: typeof this.data = [];

  @query('sc-dropdown-multi-select') dropdown: ScDropdownMultiSelect;

  getStaticData() {
    return this.data = (this.staticData ?? this.column.getStaticFilterData)?.() ?? [];
  }
  getDynamicData = async (keyword?: string) => {
    const fn = this.column.getFilterLookup();
    if (fn instanceof Function) {
      this.dropdown.loading = !this.data.length && !this.dropdown?.data?.length;
      const res = await fn(keyword);
      if (this.isConnected) {
        this.data = res;
        
        Promise.all([this.updateComplete, this.dropdown.updateComplete]).then(
          () => (this.dropdown.value = [...(this.value ?? [])])
        );
        this.dropdown.loading = false;
      }
    }
    return this.data;
  };

  getDataLookupFn() {
    return this.column.getFilterLookup() ? this.getDynamicData : undefined;
  }

  handleScSelect(e: CustomEvent) {
    const selectedValues = e.detail.value as string[];
    this.value = selectedValues;
    this.selectedData = selectedValues
      .map(
        v =>
          this.data.find(d => d.value === v) ??
          this.selectedData.find(d => d.value === v)
      )
      .filter(Boolean) as typeof this.data;
    this.bindFilterValue(selectedValues);
  }
  connectedCallback(): void {
    super.connectedCallback();

    this.updateComplete.then(() => {
      const dropdown = this.dropdown;
      if (dropdown) {
        dropdown.value = this.value ?? [];
        dropdown.searchValue = '';
        dropdown.triggerLookup('');
      }
    });
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    const dropdown = this.dropdown;
    if (dropdown) {
      dropdown.value = [];
    }
  }

  render() {
    const dataLookup = this.getDataLookupFn();
    if (!dataLookup)
      this.getStaticData();
    let data = this.data;

    const missing = this.selectedData.filter(
      d => !this.data.find(dd => dd.value === d.value)
    );
    if (missing.length) {
      data = [...missing, ...this.data];
    }

    return html`<sc-dropdown-multi-select
      select-all
      ?multiple-rows=${this.filterMultipleRows}
      clearable
      hoist
      threshold="1"
      .dataLookup=${dataLookup}
      @sc-select=${this.handleScSelect}
      .value=${this.value ?? []}
      .data=${data}
      border-type="box"
      retry-button=""
    >
    </sc-dropdown-multi-select>`;
  }
}
