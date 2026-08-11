import { defineElement } from "./define-element.js";
import { ScLabel } from "../src/components/ScLabel/ScLabel.js";
export * from "../src/components/ScLabel/ScLabel.js";

defineElement("sc-label", ScLabel);
declare global {
  interface HTMLElementTagNameMap {
    "sc-label": ScLabel;
  }
}
