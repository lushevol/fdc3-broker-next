import { defineElement } from "./define-element.js";
import { ScCard } from "../src/components/ScCard/ScCard.js";
export * from "../src/components/ScCard/ScCard.js";

defineElement("sc-card", ScCard);

declare global {
  interface HTMLElementTagNameMap {
    "sc-card": ScCard;
  }
}
