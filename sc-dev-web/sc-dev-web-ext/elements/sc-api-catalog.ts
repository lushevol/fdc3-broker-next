import { ScApiCatalog } from '../src/components/ScApiCatalog/ScApiCatalog.js';
export * from '../src/components/ScApiCatalog/ScApiCatalog.js';

window.customElements.define('sc-api-catalog', ScApiCatalog);

declare global {
  interface HTMLElementTagNameMap {
    'sc-api-catalog': ScApiCatalog,
  }
}