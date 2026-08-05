import { defineElement } from "./define-element.js";
import { ScRating } from "../src/components/ScRating.js";
export * from "../src/components/ScRating.js";

defineElement("sc-rating", ScRating);

declare global {
  interface HTMLElementTagNameMap {
    "sc-rating": ScRating;
  }
}
