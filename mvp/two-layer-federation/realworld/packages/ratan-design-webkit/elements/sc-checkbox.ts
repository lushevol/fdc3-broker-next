import { ScCheckbox } from '../src/components/ScCheckbox/ScCheckbox.js';
import { ScCheckboxGroup } from '../src/components/ScCheckbox/ScCheckboxGroup.js';
export * from '../src/components/ScCheckbox/ScCheckbox.js';
export * from '../src/components/ScCheckbox/ScCheckboxGroup.js';

if (!window.customElements.get('sc-checkbox')) window.customElements.define('sc-checkbox', ScCheckbox);
if (!window.customElements.get('sc-checkbox-group')) window.customElements.define('sc-checkbox-group', ScCheckboxGroup);

declare global {
  interface HTMLElementTagNameMap {
    'sc-checkbox': ScCheckbox;
    'sc-checkbox-group': ScCheckboxGroup;
  }
}
