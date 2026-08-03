import { ScBottomNavbar } from '../src/components/ScNavbar/ScBottomNavbar.js';
export * from '../src/components/ScNavbar/ScBottomNavbar.js';

if (!window.customElements.get('sc-bottom-navbar')) window.customElements.define('sc-bottom-navbar', ScBottomNavbar);

declare global {
  interface HTMLElementTagNameMap {
    'sc-bottom-navbar': ScBottomNavbar;
  }
}
