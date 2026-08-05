import { defineElement } from "./define-element.js";
import { ScSearchLayout } from "../src/components/ScLayout/ScSearchLayout.js";
export * from "../src/components/ScLayout/ScSearchLayout.js";

defineElement("sc-search-layout", ScSearchLayout);

declare global {
  interface HTMLElementTagNameMap {
    "sc-search-layout": ScSearchLayout;
  }
}
