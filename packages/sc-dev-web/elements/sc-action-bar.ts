import { defineElement } from "./define-element.js";
import { ScActionBar } from "../src/components/ScActionBar/ScActionBar.js";
export * from "../src/components/ScActionBar/ScActionBar.js";

defineElement("sc-action-bar", ScActionBar);

declare global {
  interface HTMLElementTagNameMap {
    "sc-action-bar": ScActionBar;
  }
}
