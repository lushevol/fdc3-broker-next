import { ScPagination } from '../src/components/ScPagination/ScPagination.js';
export * from '../src/components/ScPagination/ScPagination.js';

window.customElements.define('sc-pagination', ScPagination);
declare global {
  interface HTMLElementTagNameMap {
    'sc-pagination': ScPagination;
  }
}
