import { defineElement } from "./define-element.js";
import { ScBox } from "../src/components/ScBox/ScBox.js";
export * from "../src/components/ScBox/ScBox.js";

defineElement("sc-box", ScBox);

declare global {
  interface HTMLElementTagNameMap {
    "sc-box": ScBox;
  }
}
