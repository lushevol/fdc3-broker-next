import { defineElement } from "./define-element.js";
import { ScDivider } from "../src/components/ScDivider/ScDivider.js";
export * from "../src/components/ScDivider/ScDivider.js";

defineElement("sc-divider", ScDivider);
declare global {
  interface HTMLElementTagNameMap {
    "sc-divider": ScDivider;
  }
}
