import { DynamicDisplay } from './DynamicDisplay.js';
import { DynamicDisplayEditor } from './DynamicDisplayEditor.js';

if (!window.customElements.get('form-dynamic-display')) {
  window.customElements.define('form-dynamic-display', DynamicDisplay);
}
if (!window.customElements.get('form-dynamic-display-editor')) {
  window.customElements.define('form-dynamic-display-editor', DynamicDisplayEditor);
}
