import { ScPasswordInput } from '../src/components/ScFormInput/ScPasswordInput.js';
export * from '../src/components/ScFormInput/ScPasswordInput.js';

if (!window.customElements.get('sc-password-input')) window.customElements.define('sc-password-input', ScPasswordInput);

declare global {
  interface HTMLElementTagNameMap {
    'sc-password-input': ScPasswordInput;
  }
}
