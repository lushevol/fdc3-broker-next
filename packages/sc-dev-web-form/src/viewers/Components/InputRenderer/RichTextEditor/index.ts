import { RichTextEditor } from './RichTextEditor.js';
import { RichTextEditorEditor } from './RichTextEditorEditor.js';

if (!window.customElements.get('form-rich-text-editor')) {
  window.customElements.define('form-rich-text-editor', RichTextEditor);
}
if (!window.customElements.get('form-rich-text-editor-editor')) {
  window.customElements.define('form-rich-text-editor-editor', RichTextEditorEditor);
}