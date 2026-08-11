import { defineElement } from "./define-element.js";
import { ScDataView } from "../src/components/ScDataView/ScDataView.js";
export * from "../src/components/ScDataView/ScDataView.js";

defineElement("sc-data-view", ScDataView);

declare global {
  interface HTMLElementTagNameMap {
    "sc-data-view": ScDataView;
  }
}
