import { ScFileIcon } from '../src/components/ScFileList/ScFileIcon.js';
import { ScColorFileIcon } from '../src/components/ScFileList/ScColorFileIcon.js';
export * from '../src/components/ScFileList/ScFileIcon.js';
export * from '../src/components/ScFileList/ScColorFileIcon.js';

window.customElements.define('sc-file-icon', ScFileIcon);
declare global {
  interface HTMLElementTagNameMap {
    'sc-file-icon': ScFileIcon;
    'sc-color-file-icon': ScColorFileIcon;
  }
}
