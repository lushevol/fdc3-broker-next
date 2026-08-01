import { ScActionSheet } from '../src/components/ScSheet/ScActionSheet.js';
export * from '../src/components/ScSheet/ScActionSheet.js';

window.customElements.define('sc-action-sheet', ScActionSheet);

declare global {
  interface HTMLElementTagNameMap {
    'sc-action-sheet': ScActionSheet;
  }
}
