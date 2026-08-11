import { Spacer } from './Spacer.js';
import { SpacerEditor } from './SpacerEditor.js';

if (!window.customElements.get('form-spacer')) {
  window.customElements.define('form-spacer', Spacer);
}
if (!window.customElements.get('form-spacer-editor')) {
  window.customElements.define('form-spacer-editor', SpacerEditor);
}
