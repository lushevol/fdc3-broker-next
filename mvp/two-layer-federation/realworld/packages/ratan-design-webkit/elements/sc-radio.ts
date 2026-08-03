import { ScRadio } from '../src/components/ScRadio/ScRadio.js';
export * from '../src/components/ScRadio/ScRadio.js';

if (!window.customElements.get('sc-radio')) window.customElements.define('sc-radio', ScRadio);

declare global {
  interface HTMLElementTagNameMap {
    'sc-radio': ScRadio;
  }
}
