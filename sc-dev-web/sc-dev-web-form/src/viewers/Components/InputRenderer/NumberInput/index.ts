import { NumberInput } from './NumberInput.js';
import { NumberInputEditor } from './NumberInputEditor.js';

if (!window.customElements.get('form-number-input')) {
  window.customElements.define('form-number-input', NumberInput);
}
if (!window.customElements.get('form-number-input-editor')) {
  window.customElements.define('form-number-input-editor', NumberInputEditor);
}
