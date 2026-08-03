import { ScListNavigationItem } from '../src/components/ScListNavigation/ScListNavigationItem.js';
import { ScListNavigation } from '../src/components/ScListNavigation/ScListNavigation.js';
export * from '../src/components/ScListNavigation/ScListNavigationItem.js';
export * from '../src/components/ScListNavigation/ScListNavigation.js';

if (!window.customElements.get('sc-list-navigation-item')) window.customElements.define('sc-list-navigation-item', ScListNavigationItem);
if (!window.customElements.get('sc-list-navigation')) window.customElements.define('sc-list-navigation', ScListNavigation);

declare global {
  interface HTMLElementTagNameMap {
    'sc-list-navigation-item': ScListNavigationItem;
    'sc-list-navigation': ScListNavigation;
  }
}
