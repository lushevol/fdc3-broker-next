import { Toggle } from './Toggle.js';
import { ToggleEditor } from './ToggleEditor.js';

if (!window.customElements.get('form-toggle')) {
  window.customElements.define('form-toggle', Toggle);
}
if (!window.customElements.get('form-toggle-editor')) {
  window.customElements.define('form-toggle-editor', ToggleEditor);
}