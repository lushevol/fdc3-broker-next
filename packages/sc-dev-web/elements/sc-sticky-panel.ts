import { defineElement } from "./define-element.js";
import { ScStickyPanel } from "../src/components/ScPanel/ScStickyPanel.js";
export * from "../src/components/ScPanel/ScStickyPanel.js";

defineElement("sc-sticky-panel", ScStickyPanel);

declare global {
  interface HTMLElementTagNameMap {
    "sc-sticky-panel": ScStickyPanel;
  }
}
