import { ScDivider } from '../src/components/ScDivider/ScDivider.js';
export * from '../src/components/ScDivider/ScDivider.js';

window.customElements.define('sc-divider', ScDivider);
declare global {
  interface HTMLElementTagNameMap {
    'sc-divider': ScDivider
  }
}