import { defineElement } from "./define-element.js";
import { ScAvatar } from "../src/components/ScAvatar/ScAvatar.js";
export * from "../src/components/ScAvatar/ScAvatar.js";

defineElement("sc-avatar", ScAvatar);

declare global {
  interface HTMLElementTagNameMap {
    "sc-avatar": ScAvatar;
  }
}
