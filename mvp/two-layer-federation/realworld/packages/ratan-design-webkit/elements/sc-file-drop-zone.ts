import { ScFileDropZone } from '../src/components/ScFileList/ScFileDropZone.js';
export * from '../src/components/ScFileList/ScFileDropZone.js';

window.customElements.define('sc-file-drop-zone', ScFileDropZone);

declare global {
  interface HTMLElementTagNameMap {
    'sc-file-drop-zone': ScFileDropZone;
  }
}
