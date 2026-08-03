import { ScBottomSheet } from '../src/components/ScSheet/ScBottomSheet.js';
export * from '../src/components/ScSheet/ScBottomSheet.js';

if (!window.customElements.get('sc-bottom-sheet')) window.customElements.define('sc-bottom-sheet', ScBottomSheet);

declare global {
  interface HTMLElementTagNameMap {
    'sc-bottom-sheet': ScBottomSheet;
  }
}
