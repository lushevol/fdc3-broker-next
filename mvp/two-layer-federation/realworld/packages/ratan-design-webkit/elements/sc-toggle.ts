import { ScToggle } from '../src/components/ScToggle/ScToggle.js';
import { ScToggleOption } from '../src/components/ScToggle/ScToggleOption.js';
export * from '../src/components/ScToggle/ScToggle.js';
export * from '../src/components/ScToggle/ScToggleOption.js';

window.customElements.define('sc-toggle', ScToggle);
window.customElements.define('sc-toggle-option', ScToggleOption);

declare global {
  interface HTMLElementTagNameMap {
    'sc-toggle': ScToggle;
    'sc-toggle-option': ScToggleOption;
  }
}
