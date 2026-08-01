import { ScListItem } from '../src/components/ScList/ScListItem.js';
export * from '../src/components/ScList/ScListItem.js';

window.customElements.define('sc-list-item', ScListItem);
declare global {
  interface HTMLElementTagNameMap {
    'sc-list-item': ScListItem;
  }
}
