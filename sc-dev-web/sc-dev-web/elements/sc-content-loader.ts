import { defineElement } from "./define-element.js";
import { ScContentLoader } from "../src/components/ScLoader/ScContentLoader.js";
export * from "../src/components/ScLoader/ScContentLoader.js";

defineElement("sc-content-loader", ScContentLoader);
declare global {
  interface HTMLElementTagNameMap {
    "sc-content-loader": ScContentLoader;
  }
}
