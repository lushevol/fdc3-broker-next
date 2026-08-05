import { defineElement } from "./define-element.js";
import { ScScrollToTop } from "../src/components/ScScrollToTop/ScScrollToTop.js";
export * from "../src/components/ScScrollToTop/ScScrollToTop.js";

defineElement("sc-scroll-to-top", ScScrollToTop);

declare global {
  interface HTMLElementTagNameMap {
    "sc-scroll-to-top": ScScrollToTop;
  }
}
