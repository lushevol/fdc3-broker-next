import { FormattedInput } from './FormattedInput.js';
import { FormattedInputEditor } from './FormattedInputEditor.js';

if (!window.customElements.get('form-formatted-input')) {
  window.customElements.define('form-formatted-input', FormattedInput);
}
if (!window.customElements.get('form-formatted-input-editor')) {
  window.customElements.define('form-formatted-input-editor', FormattedInputEditor);
}