import { ScCarouselItem } from '../src/components/ScCarousel/ScCarouselItem.js';
export * from '../src/components/ScCarousel/ScCarouselItem.js';

if (!window.customElements.get('sc-carousel-item')) window.customElements.define('sc-carousel-item', ScCarouselItem);

declare global {
  interface HTMLElementTagNameMap {
    'sc-carousel-item': ScCarouselItem;
  }
}
