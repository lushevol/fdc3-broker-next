import { defineElement } from "./define-element.js";
import { ScRichTextEditor } from "../src/components/ScRichTextEditor/ScRichTextEditor.js";
export * from "../src/components/ScRichTextEditor/ScRichTextEditor.js";

defineElement("sc-rich-text-editor", ScRichTextEditor);

declare global {
  interface HTMLElementTagNameMap {
    "sc-rich-text-editor": ScRichTextEditor;
  }
}
