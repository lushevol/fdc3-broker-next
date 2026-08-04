import { defineElement } from "./define-element.js";
import { ScNumberInput } from "../src/components/ScFormInput/ScNumberInput.js";
export * from "../src/components/ScFormInput/ScNumberInput.js";

defineElement("sc-number-input", ScNumberInput);

declare global {
  interface HTMLElementTagNameMap {
    "sc-number-input": ScNumberInput;
  }
}
