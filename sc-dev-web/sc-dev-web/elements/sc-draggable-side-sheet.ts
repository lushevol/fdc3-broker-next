import { defineElement } from "./define-element.js";
import { ScDraggableSideSheet } from "../src/components/ScSheet/ScDraggableSideSheet.js";
export * from "../src/components/ScSheet/ScDraggableSideSheet.js";

defineElement("sc-draggable-side-sheet", ScDraggableSideSheet);

declare global {
  interface HTMLElementTagNameMap {
    "sc-draggable-side-sheet": ScDraggableSideSheet;
  }
}
