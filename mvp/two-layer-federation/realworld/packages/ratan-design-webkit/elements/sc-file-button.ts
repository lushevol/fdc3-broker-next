import { ScFileButton } from '../src/components/ScFileList/ScFileButton.js';
export * from '../src/components/ScFileList/ScFileButton.js';

if (!window.customElements.get('sc-file-button')) window.customElements.define('sc-file-button', ScFileButton);

declare global {
  interface HTMLElementTagNameMap {
    'sc-file-button': ScFileButton;
  }
}
