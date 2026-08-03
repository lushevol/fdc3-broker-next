import { ScStatusFilterItem } from '../src/components/ScStatusFilter/ScStatusFilterItem.js';
export * from '../src/components/ScStatusFilter/ScStatusFilterItem.js';

if (!window.customElements.get('sc-status-filter-item')) window.customElements.define('sc-status-filter-item', ScStatusFilterItem);

declare global {
  interface HTMLElementTagNameMap {
    'sc-status-filter-item': ScStatusFilterItem;
  }
}
