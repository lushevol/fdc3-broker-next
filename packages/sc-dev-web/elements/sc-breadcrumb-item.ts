import { defineElement } from "./define-element.js";
import { ScBreadcrumbItem } from "../src/components/ScBreadcrumb/ScBreadcrumbItem.js";
export * from "../src/components/ScBreadcrumb/ScBreadcrumbItem.js";

defineElement("sc-breadcrumb-item", ScBreadcrumbItem);

declare global {
  interface HTMLElementTagNameMap {
    "sc-breadcrumb-item": ScBreadcrumbItem;
  }
}
