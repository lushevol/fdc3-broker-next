import { defineElement } from "./define-element.js";
import { ScSlider } from "../src/components/ScSlider/ScSlider.js";
export * from "../src/components/ScSlider/ScSlider.js";

defineElement("sc-slider", ScSlider);

declare global {
  interface HTMLElementTagNameMap {
    "sc-slider": ScSlider;
  }
}
