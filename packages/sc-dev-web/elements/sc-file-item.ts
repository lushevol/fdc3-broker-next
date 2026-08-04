import { defineElement } from "./define-element.js";
import { ScFileItem } from "../src/components/ScFileList/ScFileItem.js";
export * from "../src/components/ScFileList/ScFileItem.js";

defineElement("sc-file-item", ScFileItem);
declare global {
  interface HTMLElementTagNameMap {
    "sc-file-item": ScFileItem;
  }
}
