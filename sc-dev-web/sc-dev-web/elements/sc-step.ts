import { defineElement } from "./define-element.js";
import { ScStep } from "../src/components/ScStepper/ScStep.js";
export * from "../src/components/ScStepper/ScStep.js";

defineElement("sc-step", ScStep);

declare global {
  interface HTMLElementTagNameMap {
    "sc-step": ScStep;
  }
}
