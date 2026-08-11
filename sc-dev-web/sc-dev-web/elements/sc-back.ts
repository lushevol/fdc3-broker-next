import { defineElement } from "./define-element.js";
import { ScBack } from "../src/components/ScBack/ScBack.js";
export * from "../src/components/ScBack/ScBack.js";

defineElement("sc-back", ScBack);

declare global {
  interface HTMLElementTagNameMap {
    "sc-back": ScBack;
  }
}
