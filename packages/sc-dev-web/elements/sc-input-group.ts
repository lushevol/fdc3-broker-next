import { defineElement } from "./define-element.js";
import { ScInputGroup } from "../src/components/ScInputGroup/ScInputGroup.js";
export * from "../src/components/ScInputGroup/ScInputGroup.js";

defineElement("sc-input-group", ScInputGroup);
declare global {
  interface HTMLElementTagNameMap {
    "sc-input-group": ScInputGroup;
  }
}
