import { defineElement } from "./define-element.js";
import { ScAccordion } from "../src/components/ScAccordion/ScAccordion.js";
export * from "../src/components/ScAccordion/ScAccordion.js";

defineElement("sc-accordion", ScAccordion);

declare global {
  interface HTMLElementTagNameMap {
    "sc-accordion": ScAccordion;
  }
}
