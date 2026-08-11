import { defineElement } from "./define-element.js";
import { ScFormattedInput } from "../src/components/ScFormInput/ScFormattedInput.js";
export * from "../src/components/ScFormInput/ScFormattedInput.js";

defineElement("sc-formatted-input", ScFormattedInput);

declare global {
  interface HTMLElementTagNameMap {
    "sc-formatted-input": ScFormattedInput;
  }
}
