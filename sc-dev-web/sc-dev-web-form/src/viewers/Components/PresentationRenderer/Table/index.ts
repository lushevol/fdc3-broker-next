import { Table } from './Table.js';
import { TableEditor } from './TableEditor.js';

if (!window.customElements.get('form-table')) {
  window.customElements.define('form-table', Table);
}
if (!window.customElements.get('form-table-editor')) {
  window.customElements.define('form-table-editor', TableEditor);
}
