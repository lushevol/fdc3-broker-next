import { ScBanner } from '../src/components/ScBanner/ScBanner.js';
export * from '../src/components/ScBanner/ScBanner.js';

window.customElements.define('sc-banner', ScBanner);

declare global {
  interface HTMLElementTagNameMap {
    'sc-banner': ScBanner;
  }
}
