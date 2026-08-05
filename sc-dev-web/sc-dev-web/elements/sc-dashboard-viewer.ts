import { defineElement } from "./define-element.js";
import { ScDashboardViewer } from "../src/components/ScDashboardViewer/ScDashboardViewer.js";

export * from "../src/components/ScDashboardViewer/ScDashboardViewer.js";

defineElement("sc-dashboard-viewer", ScDashboardViewer);

declare global {
  interface HTMLElementTagNameMap {
    "sc-dashboard-viewer": ScDashboardViewer;
  }
}
