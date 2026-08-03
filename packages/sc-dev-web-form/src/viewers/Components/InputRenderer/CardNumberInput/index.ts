import { CardNumberInput } from './CardNumberInput.js';
import { CardNumberInputEditor } from './CardNumberInputEditor.js';

if (!window.customElements.get('form-card-number-input')) {
  window.customElements.define('form-card-number-input', CardNumberInput);
}
if (!window.customElements.get('form-card-number-input-editor')) {
  window.customElements.define('form-card-number-input-editor', CardNumberInputEditor);
}