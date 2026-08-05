import { Comments } from './Comments.js';
import { CommentsEditor } from './CommentsEditor.js';

if (!window.customElements.get('form-comments')) {
  window.customElements.define('form-comments', Comments);
}
if (!window.customElements.get('form-comments-editor')) {
  window.customElements.define('form-comments-editor', CommentsEditor);
}
