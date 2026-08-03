import { Image } from './Image.js';
import { ImageEditor } from './ImageEditor.js';

if (!window.customElements.get('form-image')) {
  window.customElements.define('form-image', Image);
}
if (!window.customElements.get('form-image-editor')) {
  window.customElements.define('form-image-editor', ImageEditor);
}
