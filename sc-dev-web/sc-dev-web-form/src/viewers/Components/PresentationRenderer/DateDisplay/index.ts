import { DateDisplay } from './DateDisplay.js';
import { DateDisplayEditor } from './DateDisplayEditor.js';

if (!window.customElements.get('form-date-display')) {
  window.customElements.define('form-date-display', DateDisplay);
}
if (!window.customElements.get('form-date-display-editor')) {
  window.customElements.define('form-date-display-editor', DateDisplayEditor);
}