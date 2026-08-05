import { Switch } from './Switch.js';
import { SwitchEditor } from './SwitchEditor.js';

if (!window.customElements.get('form-switch')) {
  window.customElements.define('form-switch', Switch);
}
if (!window.customElements.get('form-switch-editor')) {
  window.customElements.define('form-switch-editor', SwitchEditor);
}