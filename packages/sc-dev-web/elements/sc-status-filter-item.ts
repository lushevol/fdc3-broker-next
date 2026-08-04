import { defineElement } from "./define-element.js";
import { ScStatusFilterItem } from "../src/components/ScStatusFilter/ScStatusFilterItem.js";
export * from "../src/components/ScStatusFilter/ScStatusFilterItem.js";

defineElement("sc-status-filter-item", ScStatusFilterItem);

declare global {
  interface HTMLElementTagNameMap {
    "sc-status-filter-item": ScStatusFilterItem;
  }
}
