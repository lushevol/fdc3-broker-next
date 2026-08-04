import { defineElement } from "./define-element.js";
import { ScButton } from "../src/components/ScButton/ScButton.js";
import { ScButtonDropdown } from "../src/components/ScButton/ScButtonDropdown.js";
export * from "../src/components/ScButton/ScButton.js";
export * from "../src/components/ScButton/ScButtonDropdown.js";

defineElement("sc-button", ScButton);
defineElement("sc-button-dropdown", ScButtonDropdown);

declare global {
  interface HTMLElementTagNameMap {
    "sc-button": ScButton;
    "sc-button-dropdown": ScButtonDropdown;
  }
}
