import { defineElement } from "./define-element.js";
import { ScTimeInput } from "../src/components/ScTimeInput/ScTimeInput.js";
export * from "../src/components/ScTimeInput/ScTimeInput.js";

defineElement("sc-time-input", ScTimeInput);

declare global {
  interface HTMLElementTagNameMap {
    "sc-time-input": ScTimeInput;
  }
}
