import { DataView } from './DataView.js';
import { DataViewEditor } from './DataViewEditor.js';

if (!window.customElements.get('form-data-view')) {
  window.customElements.define('form-data-view', DataView);
}
if (!window.customElements.get('form-data-view-editor')) {
  window.customElements.define('form-data-view-editor', DataViewEditor);
}
