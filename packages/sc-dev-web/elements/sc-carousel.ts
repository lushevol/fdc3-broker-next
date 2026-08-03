import { ScCarousel } from '../src/components/ScCarousel/ScCarousel.js';
export * from '../src/components/ScCarousel/ScCarousel.js';

window.customElements.define('sc-carousel', ScCarousel);

declare global {
  interface HTMLElementTagNameMap {
    'sc-carousel': ScCarousel
  }
}