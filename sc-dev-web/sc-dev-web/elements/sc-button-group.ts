import { defineElement } from "./define-element.js";
import { ScButtonGroup } from "../src/components/ScButtonGroup/ScButtonGroup.js";
import { ScButtonGroupItem } from "../src/components/ScButtonGroup/ScButtonGroupItem.js";
export * from "../src/components/ScButtonGroup/ScButtonGroup.js";
export * from "../src/components/ScButtonGroup/ScButtonGroupItem.js";

defineElement("sc-button-group", ScButtonGroup);
defineElement("sc-button-group-item", ScButtonGroupItem);

declare global {
  interface HTMLElementTagNameMap {
    "sc-button-group": ScButtonGroup;
    "sc-button-group-item": ScButtonGroup;
  }
}
