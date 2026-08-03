import { ScStatusFilter } from '../src/components/ScStatusFilter/ScStatusFilter.js';
export * from '../src/components/ScStatusFilter/ScStatusFilter.js';

if (!window.customElements.get('sc-status-filter')) window.customElements.define('sc-status-filter', ScStatusFilter);

declare global {
  interface HTMLElementTagNameMap {
    'sc-status-filter': ScStatusFilter;
  }
}
