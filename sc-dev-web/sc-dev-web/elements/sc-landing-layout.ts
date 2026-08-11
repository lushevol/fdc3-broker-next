import { defineElement } from "./define-element.js";
import { ScLandingLayout } from "../src/components/ScLayout/ScLandingLayout.js";
export * from "../src/components/ScLayout/ScLandingLayout.js";

defineElement("sc-landing-layout", ScLandingLayout);

declare global {
  interface HTMLElementTagNameMap {
    "sc-landing-layout": ScLandingLayout;
  }
}
