import { defineElement } from "./define-element.js";
import { ScFileInput } from "../src/components/ScFileList/ScFileInput.js";
export * from "../src/components/ScFileList/ScFileInput.js";

defineElement("sc-file-input", ScFileInput);

declare global {
  interface HTMLElementTagNameMap {
    "sc-file-input": ScFileInput;
  }
}
