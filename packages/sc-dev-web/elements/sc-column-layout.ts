import { defineElement } from "./define-element.js";
import { ScColumnLayout } from "../src/components/ScLayout/ScColumnLayout.js";
export * from "../src/components/ScLayout/ScColumnLayout.js";

defineElement("sc-column-layout", ScColumnLayout);

declare global {
  interface HTMLElementTagNameMap {
    "sc-column-layout": ScColumnLayout;
  }
}
