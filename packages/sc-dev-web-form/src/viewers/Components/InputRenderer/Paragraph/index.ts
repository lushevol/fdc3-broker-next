import { Paragraph } from './Paragraph.js';
import { ParagraphEditor } from './ParagraphEditor.js';

if (!window.customElements.get('form-paragraph')) {
  window.customElements.define('form-paragraph', Paragraph);
}
if (!window.customElements.get('form-paragraph-editor')) {
  window.customElements.define('form-paragraph-editor', ParagraphEditor);
}