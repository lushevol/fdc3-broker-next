import { ScDraggableSideSheet } from '../src/components/ScSheet/ScDraggableSideSheet.js';
export * from '../src/components/ScSheet/ScDraggableSideSheet.js';

if (!window.customElements.get('sc-draggable-side-sheet')) window.customElements.define('sc-draggable-side-sheet', ScDraggableSideSheet);

declare global {
  interface HTMLElementTagNameMap {
    'sc-draggable-side-sheet': ScDraggableSideSheet;
  }
}
