import { defineElement } from "./define-element.js";
import { ScDialog } from "../src/components/ScDialog.js";
export * from "../src/components/ScDialog.js";

defineElement("sc-dialog", ScDialog);

declare global {
  interface HTMLElementTagNameMap {
    "sc-dialog": ScDialog;
  }
}
