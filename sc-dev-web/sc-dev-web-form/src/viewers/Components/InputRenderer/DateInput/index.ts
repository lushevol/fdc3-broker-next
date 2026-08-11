import { DateInput } from './DateInput.js';
import { DateInputEditor } from './DateInputEditor.js';

if (!window.customElements.get('form-date-input')) {
  window.customElements.define('form-date-input', DateInput);
}
if (!window.customElements.get('form-date-input-editor')) {
  window.customElements.define('form-date-input-editor', DateInputEditor);
}