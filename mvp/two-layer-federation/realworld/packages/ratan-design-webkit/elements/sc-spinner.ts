import { ScSpinner } from '../src/components/ScSpinner/ScSpinner.js';
export * from '../src/components/ScSpinner/ScSpinner.js';

window.customElements.define('sc-spinner', ScSpinner);

declare global {
  interface HTMLElementTagNameMap {
    'sc-spinner': ScSpinner;
  }
}
