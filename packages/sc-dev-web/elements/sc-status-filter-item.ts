import { ScStatusFilterItem } from '../src/components/ScStatusFilter/ScStatusFilterItem.js';
export * from '../src/components/ScStatusFilter/ScStatusFilterItem.js';

window.customElements.define('sc-status-filter-item', ScStatusFilterItem);

declare global {
  interface HTMLElementTagNameMap {
    'sc-status-filter-item': ScStatusFilterItem
  }
}