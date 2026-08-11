import { Checkbox } from './Checkbox.js';
import { CheckboxEditor } from './CheckboxEditor.js';

if (!window.customElements.get('form-checkbox')) {
  window.customElements.define('form-checkbox', Checkbox);
}
if (!window.customElements.get('form-checkbox-editor')) {
  window.customElements.define('form-checkbox-editor', CheckboxEditor);
}