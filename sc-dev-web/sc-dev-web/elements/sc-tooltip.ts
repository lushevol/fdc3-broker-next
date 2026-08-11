import { defineElement } from "./define-element.js";
import { ScTooltip } from "../src/components/ScTooltip/ScTooltip.js";
export * from "../src/components/ScTooltip/ScTooltip.js";

defineElement("sc-tooltip", ScTooltip);

declare global {
  interface HTMLElementTagNameMap {
    "sc-tooltip": ScTooltip;
  }
}
