import { defineElement } from "./define-element.js";
import { ScMenu } from "../src/components/ScMenu/ScMenu.js";
import { ScMenuItem } from "../src/components/ScMenu/ScMenuItem.js";
import { ScMenuLabel } from "../src/components/ScMenu/ScMenuLabel.js";
export * from "../src/components/ScMenu/ScMenu.js";
export * from "../src/components/ScMenu/ScMenuItem.js";
export * from "../src/components/ScMenu/ScMenuLabel.js";

defineElement("sc-menu", ScMenu);
defineElement("sc-menu-item", ScMenuItem);
defineElement("sc-menu-label", ScMenuLabel);

declare global {
  interface HTMLElementTagNameMap {
    "sc-menu": ScMenu;
    "sc-menu-item": ScMenuItem;
    "sc-menu-label": ScMenuLabel;
  }
}
