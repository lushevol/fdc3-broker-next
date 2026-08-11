import { defineElement } from "./define-element.js";
import { ScRepeater } from "../src/components/ScRepeater/ScRepeater.js";
export * from "../src/components/ScRepeater/ScRepeater.js";

defineElement("sc-repeater", ScRepeater);

declare global {
  interface HTMLElementTagNameMap {
    "sc-repeater": ScRepeater;
  }
}
