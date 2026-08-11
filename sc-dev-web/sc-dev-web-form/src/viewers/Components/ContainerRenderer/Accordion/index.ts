import { Accordion } from './Accordion.js';
import { AccordionEditor } from './AccordionEditor.js';

if (!window.customElements.get('form-accordion')) {
  window.customElements.define('form-accordion', Accordion);
}
if (!window.customElements.get('form-accordion-editor')) {
  window.customElements.define('form-accordion-editor', AccordionEditor);
}
