import { Box } from './Box.js';
import { BoxEditor } from './BoxEditor.js';

if (!window.customElements.get('form-box')) {
  window.customElements.define('form-box', Box);
}
if (!window.customElements.get('form-box-editor')) {
  window.customElements.define('form-box-editor', BoxEditor);
}
