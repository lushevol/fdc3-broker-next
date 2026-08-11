import { Grid1Column } from './Grid1Column.js';
import { Grid1ColumnEditor } from './Grid1ColumnEditor.js';

if (!window.customElements.get('form-grid-1-column')) {
  window.customElements.define('form-grid-1-column', Grid1Column);
}
if (!window.customElements.get('form-grid-1-column-editor')) {
  window.customElements.define('form-grid-1-column-editor', Grid1ColumnEditor);
}
