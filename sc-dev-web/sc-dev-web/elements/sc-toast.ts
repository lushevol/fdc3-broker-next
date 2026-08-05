import { defineElement } from "./define-element.js";
import { ScToast } from "../src/components/ScToast/ScToast.js";
export * from "../src/components/ScToast/ScToast.js";

defineElement("sc-toast", ScToast);

declare global {
  interface HTMLElementTagNameMap {
    "sc-toast": ScToast;
  }
}
