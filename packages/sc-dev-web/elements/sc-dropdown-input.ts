import { ScDropdownInput } from '../src/components/ScDropdown/ScDropdownInput.js';
import { ScDropdownMultiSelect } from '../src/components/ScDropdown/ScDropdownMultiSelect.js';
import { ScDropdownOption } from '../src/components/ScDropdown/ScDropdownOption.js';
export * from '../src/components/ScDropdown/ScDropdownInput.js';
export * from '../src/components/ScDropdown/ScDropdownMultiSelect.js';
export * from '../src/components/ScDropdown/ScDropdownOption.js';

window.customElements.define('sc-dropdown-input', ScDropdownInput);
window.customElements.define(
  'sc-dropdown-multi-select',
  ScDropdownMultiSelect
);
window.customElements.define('sc-dropdown-option', ScDropdownOption);

declare global {
  interface HTMLElementTagNameMap {
    'sc-dropdown-input': ScDropdownInput,
    'sc-dropdown-multi-select': ScDropdownMultiSelect,
    'sc-dropdown-option': ScDropdownOption
  }
}