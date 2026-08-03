import { RadioGroup } from './RadioGroup.js';
import { RadioGroupEditor } from './RadioGroupEditor.js';

if (!window.customElements.get('form-radio-group')) {
  window.customElements.define('form-radio-group', RadioGroup);
}
if (!window.customElements.get('form-radio-group-editor')) {
  window.customElements.define('form-radio-group-editor', RadioGroupEditor);
}