import { DropdownMultiSelect } from './DropdownMultiSelect.js';
import { DropdownMultiSelectEditor } from './DropdownMultiSelectEditor.js';

if (!window.customElements.get('form-dropdown-multi-select')) {
  window.customElements.define('form-dropdown-multi-select', DropdownMultiSelect);
}
if (!window.customElements.get('form-dropdown-multi-select-editor')) {
  window.customElements.define('form-dropdown-multi-select-editor', DropdownMultiSelectEditor);
}