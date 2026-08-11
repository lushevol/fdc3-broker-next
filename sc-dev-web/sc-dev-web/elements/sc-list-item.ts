import { defineElement } from "./define-element.js";
import { ScListItem } from "../src/components/ScList/ScListItem.js";
export * from "../src/components/ScList/ScListItem.js";

defineElement("sc-list-item", ScListItem);
declare global {
  interface HTMLElementTagNameMap {
    "sc-list-item": ScListItem;
  }
}
