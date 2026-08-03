import { ScFileInput } from '../src/components/ScFileList/ScFileInput.js';
export * from '../src/components/ScFileList/ScFileInput.js';

if (!window.customElements.get('sc-file-input')) window.customElements.define('sc-file-input', ScFileInput);

declare global {
  interface HTMLElementTagNameMap {
    'sc-file-input': ScFileInput;
  }
}
