import { defineElement } from "./define-element.js";
import { ScToggle } from "../src/components/ScToggle/ScToggle.js";
import { ScToggleOption } from "../src/components/ScToggle/ScToggleOption.js";
export * from "../src/components/ScToggle/ScToggle.js";
export * from "../src/components/ScToggle/ScToggleOption.js";

defineElement("sc-toggle", ScToggle);
defineElement("sc-toggle-option", ScToggleOption);

declare global {
  interface HTMLElementTagNameMap {
    "sc-toggle": ScToggle;
    "sc-toggle-option": ScToggleOption;
  }
}
