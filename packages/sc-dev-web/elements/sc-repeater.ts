import { ScRepeater } from '../src/components/ScRepeater/ScRepeater.js';
export * from '../src/components/ScRepeater/ScRepeater.js';

window.customElements.define('sc-repeater', ScRepeater);

declare global {
  interface HTMLElementTagNameMap {
    'sc-repeater': ScRepeater
  }
}