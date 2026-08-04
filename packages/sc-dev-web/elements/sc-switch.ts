import { defineElement } from "./define-element.js";
import { ScSwitch } from "../src/components/ScSwitch/ScSwitch.js";
export * from "../src/components/ScSwitch/ScSwitch.js";

defineElement("sc-switch", ScSwitch);

declare global {
  interface HTMLElementTagNameMap {
    "sc-switch": ScSwitch;
  }
}
