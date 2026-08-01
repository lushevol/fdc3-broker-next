import { ScBack } from '../src/components/ScBack/ScBack.js';
export * from '../src/components/ScBack/ScBack.js';

window.customElements.define('sc-back', ScBack);

declare global {
  interface HTMLElementTagNameMap {
    'sc-back': ScBack;
  }
}
