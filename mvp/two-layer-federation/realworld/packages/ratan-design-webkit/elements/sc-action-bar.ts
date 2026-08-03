import { ScActionBar } from '../src/components/ScActionBar/ScActionBar.js';
export * from '../src/components/ScActionBar/ScActionBar.js';

if (!window.customElements.get('sc-action-bar')) window.customElements.define('sc-action-bar', ScActionBar);

declare global {
  interface HTMLElementTagNameMap {
    'sc-action-bar': ScActionBar;
  }
}
