import { defineElement } from "./define-element.js";
import { ScDate } from "../src/components/ScDate/ScDate.js";
export * from "../src/components/ScDate/ScDate.js";

defineElement("sc-date", ScDate);

declare global {
  interface HTMLElementTagNameMap {
    "sc-date": ScDate;
  }
}
