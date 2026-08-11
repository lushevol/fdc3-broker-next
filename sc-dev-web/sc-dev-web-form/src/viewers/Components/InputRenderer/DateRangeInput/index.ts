import { DateRangeInput } from './DateRangeInput.js';
import { DateRangeInputEditor } from './DateRangeInputEditor.js';

if (!window.customElements.get('form-date-range-input')) {
  window.customElements.define('form-date-range-input', DateRangeInput);
}
if (!window.customElements.get('form-date-range-input-editor')) {
  window.customElements.define('form-date-range-input-editor', DateRangeInputEditor);
}