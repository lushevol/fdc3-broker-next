import { defineElement } from "./define-element.js";
import { ScParagraph } from "../src/components/ScTypography/ScParagraph.js";
export * from "../src/components/ScTypography/ScParagraph.js";

defineElement("sc-paragraph", ScParagraph);

declare global {
  interface HTMLElementTagNameMap {
    "sc-paragraph": ScParagraph;
  }
}
