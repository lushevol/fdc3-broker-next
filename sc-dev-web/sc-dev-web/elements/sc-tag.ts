import { defineElement } from "./define-element.js";
import { ScTag } from "../src/components/ScTag/ScTag.js";
import { ScClosableTag } from "../src/components/ScTag/ScClosableTag.js";
export * from "../src/components/ScTag/ScTag.js";
export * from "../src/components/ScTag/ScClosableTag.js";

defineElement("sc-tag", ScTag);
defineElement("sc-closable-tag", ScClosableTag);

declare global {
  interface HTMLElementTagNameMap {
    "sc-tag": ScTag;
    "sc-closable-tag": ScClosableTag;
  }
}
