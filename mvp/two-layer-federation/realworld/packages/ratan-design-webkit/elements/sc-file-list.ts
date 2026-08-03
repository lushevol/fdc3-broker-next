import { ScFileList } from '../src/components/ScFileList/ScFileList.js';
export * from '../src/components/ScFileList/ScFileList.js';

if (!window.customElements.get('sc-file-list')) window.customElements.define('sc-file-list', ScFileList);
declare global {
  interface HTMLElementTagNameMap {
    'sc-file-list': ScFileList;
  }
}
