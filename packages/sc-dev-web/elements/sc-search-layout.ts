import { ScSearchLayout } from '../src/components/ScLayout/ScSearchLayout.js';
export * from '../src/components/ScLayout/ScSearchLayout.js';

window.customElements.define('sc-search-layout', ScSearchLayout);

declare global {
  interface HTMLElementTagNameMap {
    'sc-search-layout': ScSearchLayout,
  }
}