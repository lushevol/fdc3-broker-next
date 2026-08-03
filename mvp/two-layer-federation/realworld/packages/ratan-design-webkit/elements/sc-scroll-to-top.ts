import { ScScrollToTop } from '../src/components/ScScrollToTop/ScScrollToTop.js';
export * from '../src/components/ScScrollToTop/ScScrollToTop.js';

if (!window.customElements.get('sc-scroll-to-top')) window.customElements.define('sc-scroll-to-top', ScScrollToTop);

declare global {
  interface HTMLElementTagNameMap {
    'sc-scroll-to-top': ScScrollToTop;
  }
}
