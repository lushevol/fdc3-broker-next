import { defineElement } from "./define-element.js";
import { ScMenuBar } from "../src/components/ScMenuBar/ScMenuBar.js";
export * from "../src/components/ScMenuBar/ScMenuBar.js";

defineElement("sc-menu-bar", ScMenuBar);

declare global {
  interface HTMLElementTagNameMap {
    "sc-menu-bar": ScMenuBar;
  }
}
