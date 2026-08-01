import { ScTextInput } from '../src/components/ScFormInput/ScTextInput.js';
export * from '../src/components/ScFormInput/ScTextInput.js';

window.customElements.define('sc-text-input', ScTextInput);

declare global {
  interface HTMLElementTagNameMap {
    'sc-text-input': ScTextInput;
  }
}
