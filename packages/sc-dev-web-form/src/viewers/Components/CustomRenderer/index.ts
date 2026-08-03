import { CustomComponent } from './CustomComponent.js';
import { CustomComponentEditor } from './CustomComponentEditor.js';

if (!window.customElements.get('form-custom-component')) {
  window.customElements.define('form-custom-component', CustomComponent);
}
if (!window.customElements.get('form-custom-component-editor')) {
  window.customElements.define('form-custom-component-editor', CustomComponentEditor);
}