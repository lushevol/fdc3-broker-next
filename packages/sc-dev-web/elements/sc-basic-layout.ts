import { defineElement } from "./define-element.js";
import { ScBasicLayout } from "../src/components/ScLayout/ScBasicLayout.js";
export * from "../src/components/ScLayout/ScBasicLayout.js";

defineElement("sc-basic-layout", ScBasicLayout);

declare global {
  interface HTMLElementTagNameMap {
    "sc-basic-layout": ScBasicLayout;
  }
}
