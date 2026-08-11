import { defineElement } from "./define-element.js";
import { ScFileButton } from "../src/components/ScFileList/ScFileButton.js";
export * from "../src/components/ScFileList/ScFileButton.js";

defineElement("sc-file-button", ScFileButton);

declare global {
  interface HTMLElementTagNameMap {
    "sc-file-button": ScFileButton;
  }
}
