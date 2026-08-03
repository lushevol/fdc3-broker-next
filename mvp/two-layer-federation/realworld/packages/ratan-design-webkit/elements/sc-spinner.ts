import { ScSpinner } from '../src/components/ScSpinner/ScSpinner.js';
export * from '../src/components/ScSpinner/ScSpinner.js';

if (!window.customElements.get('sc-spinner')) window.customElements.define('sc-spinner', ScSpinner);

declare global {
  interface HTMLElementTagNameMap {
    'sc-spinner': ScSpinner;
  }
}
