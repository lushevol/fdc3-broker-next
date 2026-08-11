import { defineElement } from "./define-element.js";
import { ScFileList } from "../src/components/ScFileList/ScFileList.js";
export * from "../src/components/ScFileList/ScFileList.js";

defineElement("sc-file-list", ScFileList);
declare global {
  interface HTMLElementTagNameMap {
    "sc-file-list": ScFileList;
  }
}
