import { defineElement } from "./define-element.js";
import { ScAlert } from "../src/components/ScAlert/ScAlert.js";
export * from "../src/components/ScAlert/ScAlert.js";

defineElement("sc-alert", ScAlert);

declare global {
  interface HTMLElementTagNameMap {
    "sc-alert": ScAlert;
  }
}
