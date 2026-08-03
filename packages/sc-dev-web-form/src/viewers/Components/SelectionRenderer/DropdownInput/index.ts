import { DropdownInput } from './DropdownInput.js';
import { DropdownInputEditor } from './DropdownInputEditor.js';

if (!window.customElements.get('form-dropdown-input')) {
  window.customElements.define('form-dropdown-input', DropdownInput);
}
if (!window.customElements.get('form-dropdown-input-editor')) {
  window.customElements.define('form-dropdown-input-editor', DropdownInputEditor);
}