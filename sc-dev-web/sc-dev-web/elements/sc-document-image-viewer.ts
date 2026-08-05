import { defineElement } from "./define-element.js";
import { ScDocumentImageViewer } from "../src/components/ScDocumentImageViewer/ScDocumentImageViewer.js";
import "./sc-divider.js";
import "./sc-icon-button.js";
import "./sc-icon.js";
import "./sc-button.js";
export * from "../src/components/ScDocumentImageViewer/ScDocumentImageViewer.js";

defineElement("sc-document-image-viewer", ScDocumentImageViewer);

declare global {
  interface HTMLElementTagNameMap {
    "sc-document-image-viewer": ScDocumentImageViewer;
  }
}
