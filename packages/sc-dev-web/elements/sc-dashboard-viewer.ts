import { ScDashboardViewer } from '../src/components/ScDashboardViewer/ScDashboardViewer.js';

export * from '../src/components/ScDashboardViewer/ScDashboardViewer.js';

window.customElements.define('sc-dashboard-viewer', ScDashboardViewer);

declare global {
  interface HTMLElementTagNameMap {
    'sc-dashboard-viewer': ScDashboardViewer,
  }
}
