import { defineElement } from "./define-element.js";
import { ScBreadcrumbWrap } from "../src/components/ScBreadcrumb/ScBreadcrumbWrap.js";
import { ScBreadcrumb } from "../src/components/ScBreadcrumb/ScBreadcrumb.js";
export * from "../src/components/ScBreadcrumb/ScBreadcrumb.js";

defineElement("sc-breadcrumb-wrap", ScBreadcrumbWrap);
defineElement("sc-breadcrumb", ScBreadcrumb);

declare global {
  interface HTMLElementTagNameMap {
    "sc-breadcrumb": ScBreadcrumb;
    "sc-breadcrumb-wrap": ScBreadcrumbWrap;
  }
}
