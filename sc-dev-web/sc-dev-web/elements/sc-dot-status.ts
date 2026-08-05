import { defineElement } from "./define-element.js";
import { ScDotStatus } from "../src/components/ScDotStatus/ScDotStatus.js";
export * from "../src/components/ScDotStatus/ScDotStatus.js";

defineElement("sc-dot-status", ScDotStatus);
declare global {
  interface HTMLElementTagNameMap {
    "sc-dot-status": ScDotStatus;
  }
}
