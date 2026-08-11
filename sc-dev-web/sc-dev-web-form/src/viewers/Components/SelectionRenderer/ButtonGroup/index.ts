import { ButtonGroup } from './ButtonGroup.js';
import { ButtonGroupEditor } from './ButtonGroupEditor.js';

if (!window.customElements.get('form-button-group')) {
  window.customElements.define('form-button-group', ButtonGroup);
}
if (!window.customElements.get('form-button-group-editor')) {
  window.customElements.define('form-button-group-editor', ButtonGroupEditor);
}