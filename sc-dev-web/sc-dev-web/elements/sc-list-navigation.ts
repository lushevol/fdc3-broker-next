import { defineElement } from "./define-element.js";
import { ScListNavigationItem } from "../src/components/ScListNavigation/ScListNavigationItem.js";
import { ScListNavigation } from "../src/components/ScListNavigation/ScListNavigation.js";
export * from "../src/components/ScListNavigation/ScListNavigationItem.js";
export * from "../src/components/ScListNavigation/ScListNavigation.js";

defineElement("sc-list-navigation-item", ScListNavigationItem);
defineElement("sc-list-navigation", ScListNavigation);

declare global {
  interface HTMLElementTagNameMap {
    "sc-list-navigation-item": ScListNavigationItem;
    "sc-list-navigation": ScListNavigation;
  }
}
