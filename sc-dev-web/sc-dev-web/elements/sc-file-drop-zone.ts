import { defineElement } from "./define-element.js";
import { ScFileDropZone } from "../src/components/ScFileList/ScFileDropZone.js";
export * from "../src/components/ScFileList/ScFileDropZone.js";

defineElement("sc-file-drop-zone", ScFileDropZone);

declare global {
  interface HTMLElementTagNameMap {
    "sc-file-drop-zone": ScFileDropZone;
  }
}
