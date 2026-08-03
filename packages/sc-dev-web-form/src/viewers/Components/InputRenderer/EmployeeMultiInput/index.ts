import { EmployeeMultiInput } from './EmployeeMultiInput.js';
import { EmployeeMultiInputEditor } from './EmployeeMultiInputEditor.js';

if (!window.customElements.get('form-employee-multi-input')) {
  window.customElements.define('form-employee-multi-input', EmployeeMultiInput);
}
if (!window.customElements.get('form-employee-multi-input-editor')) {
  window.customElements.define('form-employee-multi-input-editor', EmployeeMultiInputEditor);
}