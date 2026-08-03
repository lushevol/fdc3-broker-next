import { ScSearchLayout } from '../src/components/ScLayout/ScSearchLayout.js';
export * from '../src/components/ScLayout/ScSearchLayout.js';

if (!window.customElements.get('sc-search-layout')) window.customElements.define('sc-search-layout', ScSearchLayout);

declare global {
  interface HTMLElementTagNameMap {
    'sc-search-layout': ScSearchLayout;
  }
}
