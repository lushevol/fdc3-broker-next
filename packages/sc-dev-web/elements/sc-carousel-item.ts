import { defineElement } from "./define-element.js";
import { ScCarouselItem } from "../src/components/ScCarousel/ScCarouselItem.js";
export * from "../src/components/ScCarousel/ScCarouselItem.js";

defineElement("sc-carousel-item", ScCarouselItem);

declare global {
  interface HTMLElementTagNameMap {
    "sc-carousel-item": ScCarouselItem;
  }
}
