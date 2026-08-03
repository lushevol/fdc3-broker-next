import { ScAccordion } from '../src/components/ScAccordion/ScAccordion.js';
export * from '../src/components/ScAccordion/ScAccordion.js';

if (!window.customElements.get('sc-accordion')) window.customElements.define('sc-accordion', ScAccordion);

declare global {
  interface HTMLElementTagNameMap {
    'sc-accordion': ScAccordion;
  }
}
