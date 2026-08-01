import { ScButton } from '../src/components/ScButton/ScButton.js';
import { ScButtonDropdown } from '../src/components/ScButton/ScButtonDropdown.js';
export * from '../src/components/ScButton/ScButton.js';
export * from '../src/components/ScButton/ScButtonDropdown.js';

window.customElements.define('sc-button', ScButton);
window.customElements.define('sc-button-dropdown', ScButtonDropdown);

declare global {
  interface HTMLElementTagNameMap {
    'sc-button': ScButton;
    'sc-button-dropdown': ScButtonDropdown;
  }
}
