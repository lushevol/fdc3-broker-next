import { EmployeeInput } from './EmployeeInput.js';
import { EmployeeInputEditor } from './EmployeeInputEditor.js';

if (!window.customElements.get('form-employee-input')) {
  window.customElements.define('form-employee-input', EmployeeInput);
}
if (!window.customElements.get('form-employee-input-editor')) {
  window.customElements.define('form-employee-input-editor', EmployeeInputEditor);
}