import { ScRichTextEditor } from '../src/components/ScRichTextEditor/ScRichTextEditor.js';
export * from '../src/components/ScRichTextEditor/ScRichTextEditor.js';

window.customElements.define('sc-rich-text-editor', ScRichTextEditor);

declare global {
  interface HTMLElementTagNameMap {
    'sc-rich-text-editor': ScRichTextEditor,
  }
}