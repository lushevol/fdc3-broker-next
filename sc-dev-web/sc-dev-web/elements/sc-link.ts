import { defineElement } from "./define-element.js";
import { ScLink } from "../src/components/ScLink/ScLink.js";
export * from "../src/components/ScLink/ScLink.js";

defineElement("sc-link", ScLink);

declare global {
  interface HTMLElementTagNameMap {
    "sc-link": ScLink;
  }
}
