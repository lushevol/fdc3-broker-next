import { ScTable } from '../src/components/ScTable/ScTable.js';
import { ScTableFilter } from '../src/components/ScTable/ScTableFilter.js';
import { ScTableHeaderWithSort } from '../src/components/ScTable/TableHeaders/ScTableHeaderWithSort.js';
export * from '../src/components/ScTable/ScTable.js';
export * from '../src/components/ScTable/TableHeaders/ScTableHeaderWithSort.js';

if (!window.customElements.get('sc-table')) window.customElements.define('sc-table', ScTable);
if (!window.customElements.get('sc-table-header-with-sort')) window.customElements.define('sc-table-header-with-sort', ScTableHeaderWithSort);
if (!window.customElements.get('sc-table-filter')) window.customElements.define('sc-table-filter', ScTableFilter);

declare global {
  interface HTMLElementTagNameMap {
    'sc-table': ScTable;
    'sc-table-header-with-sort': ScTableHeaderWithSort;
    'sc-table-filter': ScTableFilter;
  }
}
