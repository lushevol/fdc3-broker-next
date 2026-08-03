import { ScBreadcrumbWrap } from '../src/components/ScBreadcrumb/ScBreadcrumbWrap.js';
import { ScBreadcrumb } from '../src/components/ScBreadcrumb/ScBreadcrumb.js';
export * from '../src/components/ScBreadcrumb/ScBreadcrumb.js';

window.customElements.define('sc-breadcrumb-wrap', ScBreadcrumbWrap);
window.customElements.define('sc-breadcrumb', ScBreadcrumb);

declare global {
  interface HTMLElementTagNameMap {
    'sc-breadcrumb': ScBreadcrumb,
    'sc-breadcrumb-wrap': ScBreadcrumbWrap,
  }
}