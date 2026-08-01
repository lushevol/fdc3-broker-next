import { ScNavbarItem } from '../src/components/ScNavbar/ScNavbarItem.js';
export * from '../src/components/ScNavbar/ScNavbarItem.js';

window.customElements.define('sc-navbar-item', ScNavbarItem);

declare global {
  interface HTMLElementTagNameMap {
    'sc-navbar-item': ScNavbarItem;
  }
}
