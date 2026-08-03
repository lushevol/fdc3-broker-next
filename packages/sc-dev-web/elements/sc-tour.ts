import { ScTour } from '../src/components/ScTour/ScTour.js';
export * from '../src/components/ScTour/ScTour.js';

window.customElements.define('sc-tour', ScTour);

declare global {
  interface HTMLElementTagNameMap {
    'sc-tour': ScTour;
  }
}
