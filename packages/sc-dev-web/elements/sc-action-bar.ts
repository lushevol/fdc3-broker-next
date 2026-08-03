import { ScActionBar } from '../src/components/ScActionBar/ScActionBar.js';
export * from '../src/components/ScActionBar/ScActionBar.js';

window.customElements.define('sc-action-bar', ScActionBar);

declare global {
  interface HTMLElementTagNameMap {
    'sc-action-bar': ScActionBar
  }
}