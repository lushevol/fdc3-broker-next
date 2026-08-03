import { ScActionSheet } from '../src/components/ScSheet/ScActionSheet.js';
export * from '../src/components/ScSheet/ScActionSheet.js';

if (!window.customElements.get('sc-action-sheet')) window.customElements.define('sc-action-sheet', ScActionSheet);

declare global {
  interface HTMLElementTagNameMap {
    'sc-action-sheet': ScActionSheet;
  }
}
