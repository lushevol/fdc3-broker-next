import { ScBreadcrumbItem } from '../src/components/ScBreadcrumb/ScBreadcrumbItem.js';
export * from '../src/components/ScBreadcrumb/ScBreadcrumbItem.js';

window.customElements.define('sc-breadcrumb-item', ScBreadcrumbItem);

declare global {
  interface HTMLElementTagNameMap {
    'sc-breadcrumb-item': ScBreadcrumbItem;
  }
}
