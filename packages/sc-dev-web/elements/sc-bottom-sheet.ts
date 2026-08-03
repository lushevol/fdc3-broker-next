import { ScBottomSheet } from '../src/components/ScSheet/ScBottomSheet.js';
export * from '../src/components/ScSheet/ScBottomSheet.js';

window.customElements.define('sc-bottom-sheet', ScBottomSheet);

declare global {
  interface HTMLElementTagNameMap {
    'sc-bottom-sheet': ScBottomSheet
  }
}