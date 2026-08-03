import { ScDataView } from '../src/components/ScDataView/ScDataView.js';
export * from '../src/components/ScDataView/ScDataView.js';

window.customElements.define('sc-data-view', ScDataView);

declare global {
  interface HTMLElementTagNameMap {
    'sc-data-view': ScDataView
  }
}