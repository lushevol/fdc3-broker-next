import { ScAlert } from '../src/components/ScAlert/ScAlert.js';
export * from '../src/components/ScAlert/ScAlert.js';

window.customElements.define('sc-alert', ScAlert);

declare global {
  interface HTMLElementTagNameMap {
    'sc-alert': ScAlert
  }
}