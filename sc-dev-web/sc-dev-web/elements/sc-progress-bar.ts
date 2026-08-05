import { defineElement } from "./define-element.js";
import { ScProgressBar } from "../src/components/ScProgressBar/ScProgressBar.js";
export * from "../src/components/ScProgressBar/ScProgressBar.js";

defineElement("sc-progress-bar", ScProgressBar);

declare global {
  interface HTMLElementTagNameMap {
    "sc-progress-bar": ScProgressBar;
  }
}
