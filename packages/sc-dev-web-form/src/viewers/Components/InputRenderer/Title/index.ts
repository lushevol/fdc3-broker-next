import { Title } from './Title.js';
import { TitleEditor } from './TitleEditor.js';

if (!window.customElements.get('form-title')) {
  window.customElements.define('form-title', Title);
}
if (!window.customElements.get('form-title-editor')) {
  window.customElements.define('form-title-editor', TitleEditor);
}