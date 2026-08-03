import { ScRichTextEditor } from '../src/components/ScRichTextEditor/ScRichTextEditor.js';
export * from '../src/components/ScRichTextEditor/ScRichTextEditor.js';

if (!window.customElements.get('sc-rich-text-editor')) {
  window.customElements.define(
    'sc-rich-text-editor',
    ScRichTextEditor as unknown as CustomElementConstructor,
  );
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-rich-text-editor': ScRichTextEditor;
  }
}
