import { defineElement } from "./define-element.js";
import { ScBottomNavbar } from "../src/components/ScNavbar/ScBottomNavbar.js";
export * from "../src/components/ScNavbar/ScBottomNavbar.js";

defineElement("sc-bottom-navbar", ScBottomNavbar);

declare global {
  interface HTMLElementTagNameMap {
    "sc-bottom-navbar": ScBottomNavbar;
  }
}
