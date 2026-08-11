import { defineElement } from "./define-element.js";
import { ScDraggableBox } from "../src/components/ScDraggableBox/ScDraggableBox.js";
export * from "../src/components/ScDraggableBox/ScDraggableBox.js";

defineElement("sc-draggable-box", ScDraggableBox);

declare global {
  interface HTMLElementTagNameMap {
    "sc-draggable-box": ScDraggableBox;
  }
}
