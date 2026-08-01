import { ScSwitch } from '../src/components/ScSwitch/ScSwitch.js';
export * from '../src/components/ScSwitch/ScSwitch.js';

window.customElements.define('sc-switch', ScSwitch);

declare global {
  interface HTMLElementTagNameMap {
    'sc-switch': ScSwitch;
  }
}
