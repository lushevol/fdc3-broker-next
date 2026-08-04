import { defineElement } from "./define-element.js";
import { ScActionSheet } from "../src/components/ScSheet/ScActionSheet.js";
export * from "../src/components/ScSheet/ScActionSheet.js";

defineElement("sc-action-sheet", ScActionSheet);

declare global {
  interface HTMLElementTagNameMap {
    "sc-action-sheet": ScActionSheet;
  }
}
