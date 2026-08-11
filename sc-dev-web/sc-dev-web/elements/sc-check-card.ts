import { defineElement } from "./define-element.js";
import { ScCheckCard } from "../src/components/ScCard/ScCheckCard.js";
export * from "../src/components/ScCard/ScCheckCard.js";

defineElement("sc-check-card", ScCheckCard);

declare global {
  interface HTMLElementTagNameMap {
    "sc-check-card": ScCheckCard;
  }
}
