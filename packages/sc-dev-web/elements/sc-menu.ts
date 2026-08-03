import { ScMenu } from '../src/components/ScMenu/ScMenu.js';
import { ScMenuItem } from '../src/components/ScMenu/ScMenuItem.js';
import { ScMenuLabel } from '../src/components/ScMenu/ScMenuLabel.js';
export * from '../src/components/ScMenu/ScMenu.js';
export * from '../src/components/ScMenu/ScMenuItem.js';
export * from '../src/components/ScMenu/ScMenuLabel.js';

window.customElements.define('sc-menu', ScMenu);
window.customElements.define('sc-menu-item', ScMenuItem);
window.customElements.define('sc-menu-label', ScMenuLabel);

declare global {
  interface HTMLElementTagNameMap {
    'sc-menu': ScMenu,
    'sc-menu-item': ScMenuItem,
    'sc-menu-label': ScMenuLabel,
  }
}