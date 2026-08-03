import { ScDashboardViewer } from '../src/components/ScDashboardViewer/ScDashboardViewer.js';

export * from '../src/components/ScDashboardViewer/ScDashboardViewer.js';

if (!window.customElements.get('sc-dashboard-viewer')) window.customElements.define('sc-dashboard-viewer', ScDashboardViewer);

declare global {
  interface HTMLElementTagNameMap {
    'sc-dashboard-viewer': ScDashboardViewer;
  }
}
