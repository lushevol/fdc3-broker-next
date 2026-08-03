import { ScScrollToTop } from '../src/components/ScScrollToTop/ScScrollToTop.js';
export * from '../src/components/ScScrollToTop/ScScrollToTop.js';

window.customElements.define('sc-scroll-to-top', ScScrollToTop);

declare global {
  interface HTMLElementTagNameMap {
    'sc-scroll-to-top': ScScrollToTop
  }
}