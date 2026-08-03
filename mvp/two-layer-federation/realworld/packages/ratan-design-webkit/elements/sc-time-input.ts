import { ScTimeInput } from '../src/components/ScTimeInput/ScTimeInput.js';
export * from '../src/components/ScTimeInput/ScTimeInput.js';

if (!window.customElements.get('sc-time-input')) window.customElements.define('sc-time-input', ScTimeInput);

declare global {
  interface HTMLElementTagNameMap {
    'sc-time-input': ScTimeInput;
  }
}
