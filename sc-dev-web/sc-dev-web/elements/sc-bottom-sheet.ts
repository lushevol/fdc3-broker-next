import { defineElement } from "./define-element.js";
import { ScBottomSheet } from "../src/components/ScSheet/ScBottomSheet.js";
export * from "../src/components/ScSheet/ScBottomSheet.js";

defineElement("sc-bottom-sheet", ScBottomSheet);

declare global {
  interface HTMLElementTagNameMap {
    "sc-bottom-sheet": ScBottomSheet;
  }
}
