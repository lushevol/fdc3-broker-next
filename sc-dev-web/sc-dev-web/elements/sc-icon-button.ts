import { defineElement } from "./define-element.js";
import { ScIconButton } from "../src/components/ScIconButton/ScIconButton.js";
export * from "../src/components/ScIconButton/ScIconButton.js";

defineElement("sc-icon-button", ScIconButton);

declare global {
  interface HTMLElementTagNameMap {
    "sc-icon-button": ScIconButton;
  }
}
