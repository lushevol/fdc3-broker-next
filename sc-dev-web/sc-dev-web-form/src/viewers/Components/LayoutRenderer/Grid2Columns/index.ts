import { Grid2Columns } from './Grid2Columns.js';
import { Grid2ColumnsEditor } from './Grid2ColumnsEditor.js';

if (!window.customElements.get('form-grid-2-columns')) {
  window.customElements.define('form-grid-2-columns', Grid2Columns);
}
if (!window.customElements.get('form-grid-2-columns-editor')) {
  window.customElements.define('form-grid-2-columns-editor', Grid2ColumnsEditor);
}
