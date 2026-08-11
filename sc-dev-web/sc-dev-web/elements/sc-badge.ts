import { defineElement } from "./define-element.js";
import { ScBadge } from "../src/components/ScBadge/ScBadge.js";
export * from "../src/components/ScBadge/ScBadge.js";

defineElement("sc-badge", ScBadge);
declare global {
  interface HTMLElementTagNameMap {
    "sc-badge": ScBadge;
  }
}
