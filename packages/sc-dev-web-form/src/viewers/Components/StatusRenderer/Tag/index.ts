import { Tag } from './Tag.js';
import { TagEditor } from './TagEditor.js';

if (!window.customElements.get('form-tag')) {
  window.customElements.define('form-tag', Tag);
}
if (!window.customElements.get('form-tag-editor')) {
  window.customElements.define('form-tag-editor', TagEditor);
}