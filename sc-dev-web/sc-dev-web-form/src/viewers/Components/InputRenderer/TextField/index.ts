import { TextField } from './TextField.js';
import { TextFieldEditor } from './TextFieldEditor.js';

if (!window.customElements.get('form-text-field')) {
  window.customElements.define('form-text-field', TextField);
}
if (!window.customElements.get('form-text-field-editor')) {
  window.customElements.define('form-text-field-editor', TextFieldEditor);
}