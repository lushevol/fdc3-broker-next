import { defineElement } from "./define-element.js";
import { ScRadioCard } from "../src/components/ScCard/ScRadioCard.js";
export * from "../src/components/ScCard/ScRadioCard.js";

defineElement("sc-radio-card", ScRadioCard);

declare global {
  interface HTMLElementTagNameMap {
    "sc-radio-card": ScRadioCard;
  }
}
