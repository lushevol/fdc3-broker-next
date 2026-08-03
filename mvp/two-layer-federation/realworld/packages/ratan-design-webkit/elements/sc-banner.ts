import { ScBanner } from '../src/components/ScBanner/ScBanner.js';
export * from '../src/components/ScBanner/ScBanner.js';

if (!window.customElements.get('sc-banner')) window.customElements.define('sc-banner', ScBanner);

declare global {
  interface HTMLElementTagNameMap {
    'sc-banner': ScBanner;
  }
}
