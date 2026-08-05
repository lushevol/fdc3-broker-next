import { Grid3Columns } from './Grid3Columns.js';
import { Grid3ColumnsEditor } from './Grid3ColumnsEditor.js';

if (!window.customElements.get('form-grid-3-columns')) {
  window.customElements.define('form-grid-3-columns', Grid3Columns);
}
if (!window.customElements.get('form-grid-3-columns-editor')) {
  window.customElements.define('form-grid-3-columns-editor', Grid3ColumnsEditor);
}