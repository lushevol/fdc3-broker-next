import { ScBreadcrumbWrap } from '../src/components/ScBreadcrumb/ScBreadcrumbWrap.js';
import { ScBreadcrumb } from '../src/components/ScBreadcrumb/ScBreadcrumb.js';
export * from '../src/components/ScBreadcrumb/ScBreadcrumb.js';

if (!window.customElements.get('sc-breadcrumb-wrap')) window.customElements.define('sc-breadcrumb-wrap', ScBreadcrumbWrap);
if (!window.customElements.get('sc-breadcrumb')) window.customElements.define('sc-breadcrumb', ScBreadcrumb);

declare global {
  interface HTMLElementTagNameMap {
    'sc-breadcrumb': ScBreadcrumb;
    'sc-breadcrumb-wrap': ScBreadcrumbWrap;
  }
}
