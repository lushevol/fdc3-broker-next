import { defineElement } from "./define-element.js";
import { ScSnackbar } from "../src/components/ScSnackbar/ScSnackbar.js";
export * from "../src/components/ScSnackbar/ScSnackbar.js";

defineElement("sc-snackbar", ScSnackbar);

declare global {
  interface HTMLElementTagNameMap {
    "sc-snackbar": ScSnackbar;
  }
}
