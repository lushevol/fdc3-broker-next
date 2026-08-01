import { ScFormattedInput } from '../src/components/ScFormInput/ScFormattedInput.js';
export * from '../src/components/ScFormInput/ScFormattedInput.js';

window.customElements.define('sc-formatted-input', ScFormattedInput);

declare global {
  interface HTMLElementTagNameMap {
    'sc-formatted-input': ScFormattedInput;
  }
}
