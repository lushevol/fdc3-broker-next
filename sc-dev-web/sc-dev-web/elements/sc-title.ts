import { defineElement } from "./define-element.js";
import { ScTitle } from "../src/components/ScTypography/ScTitle.js";
export * from "../src/components/ScTypography/ScTitle.js";

defineElement("sc-title", ScTitle);

declare global {
  interface HTMLElementTagNameMap {
    "sc-title": ScTitle;
  }
}
