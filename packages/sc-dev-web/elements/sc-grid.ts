import { ScGridContainer } from '../src/components/ScGrid/ScGridContainer.js';
import { ScGridRow } from '../src/components/ScGrid/ScGridRow.js';
import { ScGridColumn } from '../src/components/ScGrid/ScGridColumn.js';

export * from '../src/components/ScGrid/ScGridContainer.js';
export * from '../src/components/ScGrid/ScGridRow.js';
export * from '../src/components/ScGrid/ScGridColumn.js';

window.customElements.define('sc-grid-container', ScGridContainer);
window.customElements.define('sc-grid-row', ScGridRow);
window.customElements.define('sc-grid-column', ScGridColumn);

declare global {
  interface HTMLElementTagNameMap {
    'sc-grid-container': ScGridContainer,
    'sc-grid-row': ScGridRow,
    'sc-grid-column': ScGridColumn
  }
}