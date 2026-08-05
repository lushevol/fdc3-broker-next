import { defineElement } from "./define-element.js";
import { ScSpacer } from "../src/components/ScSpacer/ScSpacer.js";
export * from "../src/components/ScSpacer/ScSpacer.js";

defineElement("sc-spacer", ScSpacer);

declare global {
  interface HTMLElementTagNameMap {
    "sc-spacer": ScSpacer;
  }
}
