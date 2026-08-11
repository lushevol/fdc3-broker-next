import { defineElement } from "./define-element.js";
import { ScCheckbox } from "../src/components/ScCheckbox/ScCheckbox.js";
import { ScCheckboxGroup } from "../src/components/ScCheckbox/ScCheckboxGroup.js";
export * from "../src/components/ScCheckbox/ScCheckbox.js";
export * from "../src/components/ScCheckbox/ScCheckboxGroup.js";

defineElement("sc-checkbox", ScCheckbox);
defineElement("sc-checkbox-group", ScCheckboxGroup);

declare global {
  interface HTMLElementTagNameMap {
    "sc-checkbox": ScCheckbox;
    "sc-checkbox-group": ScCheckboxGroup;
  }
}
