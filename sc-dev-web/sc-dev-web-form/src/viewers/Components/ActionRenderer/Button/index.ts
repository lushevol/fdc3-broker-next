import { Button } from './Button.js';
import { ButtonEditor } from './ButtonEditor.js';

if (!window.customElements.get('form-button')) {
  window.customElements.define('form-button', Button);
}
if (!window.customElements.get('form-button-editor')) {
  window.customElements.define('form-button-editor', ButtonEditor);
}