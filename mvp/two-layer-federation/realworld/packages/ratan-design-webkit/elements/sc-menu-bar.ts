import { ScMenuBar } from '../src/components/ScMenuBar/ScMenuBar.js';
export * from '../src/components/ScMenuBar/ScMenuBar.js';

window.customElements.define('sc-menu-bar', ScMenuBar);

declare global {
  interface HTMLElementTagNameMap {
    'sc-menu-bar': ScMenuBar;
  }
}
