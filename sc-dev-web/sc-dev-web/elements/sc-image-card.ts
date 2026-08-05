import { defineElement } from "./define-element.js";
import { ScImageCard } from "../src/components/ScCard/ScImageCard.js";
export * from "../src/components/ScCard/ScImageCard.js";

defineElement("sc-image-card", ScImageCard);

declare global {
  interface HTMLElementTagNameMap {
    "sc-image-card": ScImageCard;
  }
}
