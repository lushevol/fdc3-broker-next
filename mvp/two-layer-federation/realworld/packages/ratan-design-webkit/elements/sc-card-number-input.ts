import { ScCardNumberInput } from '../src/components/ScFormInput/ScCardNumberInput.js';
export * from '../src/components/ScFormInput/ScCardNumberInput.js';

window.customElements.define('sc-card-number-input', ScCardNumberInput);

declare global {
  interface HTMLElementTagNameMap {
    'sc-card-number-input': ScCardNumberInput;
  }
}
