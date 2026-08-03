import { Icon } from './Icon.js';
import { IconEditor } from './IconEditor.js';

if (!window.customElements.get('form-icon')) {
  window.customElements.define('form-icon', Icon);
}
if (!window.customElements.get('form-icon-editor')) {
  window.customElements.define('form-icon-editor', IconEditor);
}