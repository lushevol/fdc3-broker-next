import { ScLabel } from '../src/components/ScLabel/ScLabel.js';
export * from '../src/components/ScLabel/ScLabel.js';

window.customElements.define('sc-label', ScLabel);
declare global {
  interface HTMLElementTagNameMap {
    'sc-label': ScLabel,
  }
}
