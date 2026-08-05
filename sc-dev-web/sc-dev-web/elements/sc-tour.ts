import { defineElement } from "./define-element.js";
import { ScTour } from "../src/components/ScTour/ScTour.js";
export * from "../src/components/ScTour/ScTour.js";

defineElement("sc-tour", ScTour);

declare global {
  interface HTMLElementTagNameMap {
    "sc-tour": ScTour;
  }
}
