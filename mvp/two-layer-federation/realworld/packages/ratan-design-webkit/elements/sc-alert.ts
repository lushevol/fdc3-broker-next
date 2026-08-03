import { ScAlert } from '../src/components/ScAlert/ScAlert.js';
export * from '../src/components/ScAlert/ScAlert.js';

if (!window.customElements.get('sc-alert')) window.customElements.define('sc-alert', ScAlert);

declare global {
  interface HTMLElementTagNameMap {
    'sc-alert': ScAlert;
  }
}
