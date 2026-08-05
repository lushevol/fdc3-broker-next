import { defineElement } from "./define-element.js";
import { ScTextInput } from "../src/components/ScFormInput/ScTextInput.js";
export * from "../src/components/ScFormInput/ScTextInput.js";

defineElement("sc-text-input", ScTextInput);

declare global {
  interface HTMLElementTagNameMap {
    "sc-text-input": ScTextInput;
  }
}
