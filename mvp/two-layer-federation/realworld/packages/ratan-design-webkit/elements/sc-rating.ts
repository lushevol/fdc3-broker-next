import { ScRating } from '../src/components/ScRating.js';
export * from '../src/components/ScRating.js';

window.customElements.define('sc-rating', ScRating);

declare global {
  interface HTMLElementTagNameMap {
    'sc-rating': ScRating;
  }
}
