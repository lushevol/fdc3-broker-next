import { Divider } from './Divider.js';
import { DividerEditor } from './DividerEditor.js';

if (!window.customElements.get('form-divider')) {
  window.customElements.define('form-divider', Divider);
}
if (!window.customElements.get('form-divider-editor')) {
  window.customElements.define('form-divider-editor', DividerEditor);
}
