import { defineElement } from "./define-element.js";
import { ScRadio } from "../src/components/ScRadio/ScRadio.js";
export * from "../src/components/ScRadio/ScRadio.js";

defineElement("sc-radio", ScRadio);

declare global {
  interface HTMLElementTagNameMap {
    "sc-radio": ScRadio;
  }
}
