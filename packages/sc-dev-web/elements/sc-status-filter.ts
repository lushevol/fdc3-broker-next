import { defineElement } from "./define-element.js";
import { ScStatusFilter } from "../src/components/ScStatusFilter/ScStatusFilter.js";
export * from "../src/components/ScStatusFilter/ScStatusFilter.js";

defineElement("sc-status-filter", ScStatusFilter);

declare global {
  interface HTMLElementTagNameMap {
    "sc-status-filter": ScStatusFilter;
  }
}
