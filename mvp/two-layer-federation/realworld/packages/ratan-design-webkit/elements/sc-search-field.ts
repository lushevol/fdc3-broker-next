import { ScSearchField } from '../src/components/ScSearchField/ScSearchField.js';
export * from '../src/components/ScSearchField/ScSearchField.js';

if (!window.customElements.get('sc-search-field')) window.customElements.define('sc-search-field', ScSearchField);

declare global {
  interface HTMLElementTagNameMap {
    'sc-search-field': ScSearchField;
  }
}
