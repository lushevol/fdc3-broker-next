import { FileInput } from './FileInput.js';
import { FileInputEditor } from './FileInputEditor.js';

if (!window.customElements.get('form-file-input')) {
  window.customElements.define('form-file-input', FileInput);
}
if (!window.customElements.get('form-file-input-editor')) {
  window.customElements.define('form-file-input-editor', FileInputEditor);
}