import { ScOption } from '../src/components/common/ScOption.js';
export * from '../src/components/common/ScOption.js';

window.customElements.define('sc-option', ScOption);
declare global {
  interface HTMLElementTagNameMap {
    'sc-option': ScOption;
  }
}
