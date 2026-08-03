import { Label } from './Label.js';
import { LabelEditor } from './LabelEditor.js';

if (!window.customElements.get('form-label')) {
  window.customElements.define('form-label', Label);
}
if (!window.customElements.get('form-label-editor')) {
  window.customElements.define('form-label-editor', LabelEditor);
}