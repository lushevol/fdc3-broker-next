import { defineElement } from "./define-element.js";
import { ScCardNumberInput } from "../src/components/ScFormInput/ScCardNumberInput.js";
export * from "../src/components/ScFormInput/ScCardNumberInput.js";

defineElement("sc-card-number-input", ScCardNumberInput);

declare global {
  interface HTMLElementTagNameMap {
    "sc-card-number-input": ScCardNumberInput;
  }
}
