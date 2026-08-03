import { ScTable } from '../src/components/ScTable/ScTable.js';
import { ScTableFilter } from '../src/components/ScTable/ScTableFilter.js';
import { ScTableHeaderWithSort } from '../src/components/ScTable/TableHeaders/ScTableHeaderWithSort.js';
export * from '../src/components/ScTable/ScTable.js';
export * from '../src/components/ScTable/TableHeaders/ScTableHeaderWithSort.js';

window.customElements.define('sc-table', ScTable);
window.customElements.define('sc-table-header-with-sort', ScTableHeaderWithSort);
window.customElements.define('sc-table-filter', ScTableFilter);

declare global {
  interface HTMLElementTagNameMap {
    'sc-table': ScTable,
    'sc-table-header-with-sort': ScTableHeaderWithSort,
    'sc-table-filter': ScTableFilter,
  }
}