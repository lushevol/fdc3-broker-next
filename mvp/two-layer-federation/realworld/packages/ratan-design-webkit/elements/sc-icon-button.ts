import { ScIconButton } from '../src/components/ScIconButton/ScIconButton.js';
export * from '../src/components/ScIconButton/ScIconButton.js';

window.customElements.define('sc-icon-button', ScIconButton);

declare global {
  interface HTMLElementTagNameMap {
    'sc-icon-button': ScIconButton;
  }
}
