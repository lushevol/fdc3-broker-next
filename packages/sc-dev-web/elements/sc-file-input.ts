import { ScFileInput } from '../src/components/ScFileList/ScFileInput.js';
export * from '../src/components/ScFileList/ScFileInput.js';

window.customElements.define('sc-file-input', ScFileInput);

declare global {
  interface HTMLElementTagNameMap {
    'sc-file-input': ScFileInput
  }
}