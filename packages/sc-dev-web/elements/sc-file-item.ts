import { ScFileItem } from '../src/components/ScFileList/ScFileItem.js';
export * from '../src/components/ScFileList/ScFileItem.js';

window.customElements.define('sc-file-item', ScFileItem);
declare global {
  interface HTMLElementTagNameMap {
    'sc-file-item': ScFileItem,
  }
}
