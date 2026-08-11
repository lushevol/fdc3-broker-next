import { defineElement } from "./define-element.js";
import { ScSpinner } from "../src/components/ScSpinner/ScSpinner.js";
export * from "../src/components/ScSpinner/ScSpinner.js";

defineElement("sc-spinner", ScSpinner);

declare global {
  interface HTMLElementTagNameMap {
    "sc-spinner": ScSpinner;
  }
}
