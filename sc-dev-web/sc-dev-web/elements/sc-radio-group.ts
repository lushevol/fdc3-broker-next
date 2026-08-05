import { defineElement } from "./define-element.js";
import { ScRadioGroup } from "../src/components/ScRadio/ScRadioGroup.js";
export * from "../src/components/ScRadio/ScRadioGroup.js";

defineElement("sc-radio-group", ScRadioGroup);

declare global {
  interface HTMLElementTagNameMap {
    "sc-radio-group": ScRadioGroup;
  }
}
