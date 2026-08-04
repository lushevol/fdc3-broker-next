import { defineElement } from "./define-element.js";
import { ScIconCard } from "../src/components/ScCard/ScIconCard.js";
export * from "../src/components/ScCard/ScIconCard.js";

defineElement("sc-icon-card", ScIconCard);
declare global {
  interface HTMLElementTagNameMap {
    "sc-icon-card": ScIconCard;
  }
}
