import { ScCheckbox } from '../src/components/ScCheckbox/ScCheckbox.js';
import { ScCheckboxGroup } from '../src/components/ScCheckbox/ScCheckboxGroup.js';
export * from '../src/components/ScCheckbox/ScCheckbox.js';
export * from '../src/components/ScCheckbox/ScCheckboxGroup.js';

window.customElements.define('sc-checkbox', ScCheckbox);
window.customElements.define('sc-checkbox-group', ScCheckboxGroup);

declare global {
  interface HTMLElementTagNameMap {
    'sc-checkbox': ScCheckbox,
    'sc-checkbox-group': ScCheckboxGroup
  }
}