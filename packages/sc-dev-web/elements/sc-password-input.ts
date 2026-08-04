import { defineElement } from "./define-element.js";
import { ScPasswordInput } from "../src/components/ScFormInput/ScPasswordInput.js";
export * from "../src/components/ScFormInput/ScPasswordInput.js";

defineElement("sc-password-input", ScPasswordInput);

declare global {
  interface HTMLElementTagNameMap {
    "sc-password-input": ScPasswordInput;
  }
}
