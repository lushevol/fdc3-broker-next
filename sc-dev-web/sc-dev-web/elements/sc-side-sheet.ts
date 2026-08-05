import { defineElement } from "./define-element.js";
import { ScSideSheet } from "../src/components/ScSheet/ScSideSheet.js";
export * from "../src/components/ScSheet/ScSideSheet.js";

defineElement("sc-side-sheet", ScSideSheet);

declare global {
  interface HTMLElementTagNameMap {
    "sc-side-sheet": ScSideSheet;
  }
}
