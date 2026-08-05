import { defineElement } from "./define-element.js";
import { ScScrollbar } from "../src/components/ScScrollbar/ScScrollbar.js";
export * from "../src/components/ScScrollbar/ScScrollbar.js";

defineElement("sc-scrollbar", ScScrollbar);

declare global {
  interface HTMLElementTagNameMap {
    "sc-scrollbar": ScScrollbar;
  }
}
