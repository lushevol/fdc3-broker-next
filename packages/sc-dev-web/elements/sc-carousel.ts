import { defineElement } from "./define-element.js";
import { ScCarousel } from "../src/components/ScCarousel/ScCarousel.js";
export * from "../src/components/ScCarousel/ScCarousel.js";

defineElement("sc-carousel", ScCarousel);

declare global {
  interface HTMLElementTagNameMap {
    "sc-carousel": ScCarousel;
  }
}
