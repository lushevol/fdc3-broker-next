import { ScBox } from '../src/components/ScBox/ScBox.js';
export * from '../src/components/ScBox/ScBox.js';

window.customElements.define('sc-box', ScBox);

declare global {
  interface HTMLElementTagNameMap {
    'sc-box': ScBox
  }
}