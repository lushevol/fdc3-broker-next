import { ScSlider } from '../src/components/ScSlider/ScSlider.js';
export * from '../src/components/ScSlider/ScSlider.js';

window.customElements.define('sc-slider', ScSlider);

declare global {
  interface HTMLElementTagNameMap {
    'sc-slider': ScSlider;
  }
}
