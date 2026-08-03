import { ScListNavigationItem } from '../src/components/ScListNavigation/ScListNavigationItem.js';
import { ScListNavigation } from '../src/components/ScListNavigation/ScListNavigation.js';
export * from '../src/components/ScListNavigation/ScListNavigationItem.js';
export * from '../src/components/ScListNavigation/ScListNavigation.js';

window.customElements.define('sc-list-navigation-item', ScListNavigationItem);
window.customElements.define('sc-list-navigation', ScListNavigation);

declare global {
  interface HTMLElementTagNameMap {
    'sc-list-navigation-item': ScListNavigationItem,
    'sc-list-navigation': ScListNavigation
  }
}