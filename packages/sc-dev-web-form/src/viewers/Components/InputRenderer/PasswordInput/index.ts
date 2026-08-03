import { PasswordInput } from './PasswordInput.js';
import { PasswordInputEditor } from './PasswordInputEditor.js';

if (!window.customElements.get('form-password-input')) {
  window.customElements.define('form-password-input', PasswordInput);
}
if (!window.customElements.get('form-password-input-editor')) {
  window.customElements.define('form-password-input-editor', PasswordInputEditor);
}