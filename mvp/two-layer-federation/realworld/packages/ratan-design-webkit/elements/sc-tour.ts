import { ScTour } from '../src/components/ScTour/ScTour.js';
export * from '../src/components/ScTour/ScTour.js';

if (!window.customElements.get('sc-tour')) window.customElements.define('sc-tour', ScTour);

declare global {
  interface HTMLElementTagNameMap {
    'sc-tour': ScTour;
  }
}
