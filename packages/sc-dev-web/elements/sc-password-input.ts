import { ScPasswordInput } from '../src/components/ScFormInput/ScPasswordInput.js';
export * from '../src/components/ScFormInput/ScPasswordInput.js';

window.customElements.define('sc-password-input', ScPasswordInput);

declare global {
  interface HTMLElementTagNameMap {
    'sc-password-input': ScPasswordInput,
  }
}