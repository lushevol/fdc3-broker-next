import { defineElement } from "./define-element.js";
import { ScSearchField } from "../src/components/ScSearchField/ScSearchField.js";
export * from "../src/components/ScSearchField/ScSearchField.js";

defineElement("sc-search-field", ScSearchField);

declare global {
  interface HTMLElementTagNameMap {
    "sc-search-field": ScSearchField;
  }
}
