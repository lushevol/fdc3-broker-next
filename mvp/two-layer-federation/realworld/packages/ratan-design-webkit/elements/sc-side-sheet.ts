import { ScSideSheet } from '../src/components/ScSheet/ScSideSheet.js';
export * from '../src/components/ScSheet/ScSideSheet.js';

if (!window.customElements.get('sc-side-sheet')) window.customElements.define('sc-side-sheet', ScSideSheet);

declare global {
  interface HTMLElementTagNameMap {
    'sc-side-sheet': ScSideSheet;
  }
}
