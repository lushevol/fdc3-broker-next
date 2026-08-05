import { defineElement } from "./define-element.js";
import { ScNavbarItem } from "../src/components/ScNavbar/ScNavbarItem.js";
export * from "../src/components/ScNavbar/ScNavbarItem.js";

defineElement("sc-navbar-item", ScNavbarItem);

declare global {
  interface HTMLElementTagNameMap {
    "sc-navbar-item": ScNavbarItem;
  }
}
