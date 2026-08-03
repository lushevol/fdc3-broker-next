import { TimeInput } from './TimeInput.js';
import { TimeInputEditor } from './TimeInputEditor.js';

if (!window.customElements.get('form-time-input')) {
  window.customElements.define('form-time-input', TimeInput);
}
if (!window.customElements.get('form-time-input-editor')) {
  window.customElements.define('form-time-input-editor', TimeInputEditor);
}