import { defineElement } from "./define-element.js";
import { ScCopy } from "../src/components/ScCopy/ScCopy.js";
export * from "../src/components/ScCopy/ScCopy.js";

defineElement("sc-copy", ScCopy);

declare global {
  interface HTMLElementTagNameMap {
    "sc-copy": ScCopy;
  }
}
