import { ScCarouselItem } from '../src/components/ScCarousel/ScCarouselItem.js';
export * from '../src/components/ScCarousel/ScCarouselItem.js';

window.customElements.define('sc-carousel-item', ScCarouselItem);

declare global {
  interface HTMLElementTagNameMap {
    'sc-carousel-item': ScCarouselItem
  }
}