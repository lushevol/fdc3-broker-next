import { ScLabel } from '../src/components/ScLabel/ScLabel.js';
export * from '../src/components/ScLabel/ScLabel.js';

if (!window.customElements.get('sc-label')) window.customElements.define('sc-label', ScLabel);
declare global {
  interface HTMLElementTagNameMap {
    'sc-label': ScLabel;
  }
}
