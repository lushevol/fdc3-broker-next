import { ScDraggableBox } from '../src/components/ScDraggableBox/ScDraggableBox.js';
export * from '../src/components/ScDraggableBox/ScDraggableBox.js';

window.customElements.define('sc-draggable-box', ScDraggableBox);

declare global {
  interface HTMLElementTagNameMap {
    'sc-draggable-box': ScDraggableBox;
  }
}
