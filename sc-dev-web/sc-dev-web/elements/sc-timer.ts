import { defineElement } from "./define-element.js";
import { ScTimer } from "../src/components/ScTimer/ScTimer.js";
export * from "../src/components/ScTimer/ScTimer.js";

defineElement("sc-timer", ScTimer);

declare global {
  interface HTMLElementTagNameMap {
    "sc-timer": ScTimer;
  }
}
