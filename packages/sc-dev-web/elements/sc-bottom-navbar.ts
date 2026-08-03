import { ScBottomNavbar } from '../src/components/ScNavbar/ScBottomNavbar.js';
export * from '../src/components/ScNavbar/ScBottomNavbar.js';

window.customElements.define('sc-bottom-navbar', ScBottomNavbar);

declare global {
  interface HTMLElementTagNameMap {
    'sc-bottom-navbar': ScBottomNavbar
  }
}