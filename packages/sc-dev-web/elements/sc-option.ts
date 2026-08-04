import { defineElement } from "./define-element.js";
import { ScOption } from "../src/components/common/ScOption.js";
export * from "../src/components/common/ScOption.js";

defineElement("sc-option", ScOption);
declare global {
  interface HTMLElementTagNameMap {
    "sc-option": ScOption;
  }
}
