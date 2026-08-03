import { ScFileItem } from '../src/components/ScFileList/ScFileItem.js';
export * from '../src/components/ScFileList/ScFileItem.js';

if (!window.customElements.get('sc-file-item')) window.customElements.define('sc-file-item', ScFileItem);
declare global {
  interface HTMLElementTagNameMap {
    'sc-file-item': ScFileItem;
  }
}
