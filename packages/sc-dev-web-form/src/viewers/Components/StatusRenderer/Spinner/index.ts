import { Spinner } from './Spinner.js';
import { SpinnerEditor } from './SpinnerEditor.js';

if (!window.customElements.get('form-spinner')) {
  window.customElements.define('form-spinner', Spinner);
}
if (!window.customElements.get('form-spinner-editor')) {
  window.customElements.define('form-spinner-editor', SpinnerEditor);
}