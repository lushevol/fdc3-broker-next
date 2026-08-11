import { defineElement } from "./define-element.js";
import { ScPagination } from "../src/components/ScPagination/ScPagination.js";
export * from "../src/components/ScPagination/ScPagination.js";

defineElement("sc-pagination", ScPagination);
declare global {
  interface HTMLElementTagNameMap {
    "sc-pagination": ScPagination;
  }
}
