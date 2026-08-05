import { defineElement } from "./define-element.js";
import { ScStepper } from "../src/components/ScStepper/ScStepper.js";
export * from "../src/components/ScStepper/ScStepper.js";

defineElement("sc-stepper", ScStepper);

declare global {
  interface HTMLElementTagNameMap {
    "sc-stepper": ScStepper;
  }
}
