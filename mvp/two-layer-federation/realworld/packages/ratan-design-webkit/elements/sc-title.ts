import { ScTitle } from '../src/components/ScTypography/ScTitle.js';
export * from '../src/components/ScTypography/ScTitle.js';

window.customElements.define('sc-title', ScTitle);

declare global {
  interface HTMLElementTagNameMap {
    'sc-title': ScTitle;
  }
}
