import { ScDialog } from '../src/components/ScDialog.js';
export * from '../src/components/ScDialog.js';

window.customElements.define('sc-dialog', ScDialog);

declare global {
  interface HTMLElementTagNameMap {
    'sc-dialog': ScDialog
  }
}