import { ScNumberInput } from '../src/components/ScFormInput/ScNumberInput.js';
export * from '../src/components/ScFormInput/ScNumberInput.js';

window.customElements.define('sc-number-input', ScNumberInput);

declare global {
  interface HTMLElementTagNameMap {
    'sc-number-input': ScNumberInput,
  }
}