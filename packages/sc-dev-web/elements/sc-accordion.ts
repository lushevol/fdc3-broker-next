import { ScAccordion } from '../src/components/ScAccordion/ScAccordion.js';
export * from '../src/components/ScAccordion/ScAccordion.js';

window.customElements.define('sc-accordion', ScAccordion);

declare global {
  interface HTMLElementTagNameMap {
    'sc-accordion': ScAccordion
  }
}