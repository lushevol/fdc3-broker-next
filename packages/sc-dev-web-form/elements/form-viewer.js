import { FormViewer } from '../src/viewers/FormViewer/index';

if (!window.customElements.get('sc-form-viewer')) {
  window.customElements.define('sc-form-viewer', FormViewer);
}
