import { defineElement } from "./define-element.js";
import { ScModal } from "../src/components/ScModal/ScModal.js";
export * from "../src/components/ScModal/ScModal.js";

defineElement("sc-modal", ScModal);

declare global {
  interface HTMLElementTagNameMap {
    "sc-modal": ScModal;
  }
}
