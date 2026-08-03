import { ScSwitch } from '../src/components/ScSwitch/ScSwitch.js';
export * from '../src/components/ScSwitch/ScSwitch.js';

if (!window.customElements.get('sc-switch')) window.customElements.define('sc-switch', ScSwitch);

declare global {
  interface HTMLElementTagNameMap {
    'sc-switch': ScSwitch;
  }
}
