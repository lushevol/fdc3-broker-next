import { ScRadio } from '../src/components/ScRadio/ScRadio.js';
export * from '../src/components/ScRadio/ScRadio.js';

window.customElements.define('sc-radio', ScRadio);

declare global {
  interface HTMLElementTagNameMap {
    'sc-radio': ScRadio;
  }
}
