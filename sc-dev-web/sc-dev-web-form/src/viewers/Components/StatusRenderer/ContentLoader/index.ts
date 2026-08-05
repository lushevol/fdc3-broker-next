import { ContentLoader } from './ContentLoader.js';
import { ContentLoaderEditor } from './ContentLoaderEditor.js';

if (!window.customElements.get('form-content-loader')) {
  window.customElements.define('form-content-loader', ContentLoader);
}
if (!window.customElements.get('form-content-loader-editor')) {
  window.customElements.define('form-content-loader-editor', ContentLoaderEditor);
}