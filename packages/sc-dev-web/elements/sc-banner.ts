import { defineElement } from "./define-element.js";
import { ScBanner } from "../src/components/ScBanner/ScBanner.js";
export * from "../src/components/ScBanner/ScBanner.js";

defineElement("sc-banner", ScBanner);

declare global {
  interface HTMLElementTagNameMap {
    "sc-banner": ScBanner;
  }
}
