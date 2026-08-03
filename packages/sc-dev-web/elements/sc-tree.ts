import { ScTree } from '../src/components/ScTree/ScTree.js';
export * from '../src/components/ScTree/ScTree.js';

window.customElements.define('sc-tree', ScTree);

declare global {
  interface HTMLElementTagNameMap {
    'sc-tree': ScTree,
  }
}