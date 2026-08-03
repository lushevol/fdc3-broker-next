import { DocumentViewer } from './DocumentViewer.js';
import { DocumentViewerEditor } from './DocumentViewerEditor.js';

if (!window.customElements.get('form-document-viewer')) {
  window.customElements.define('form-document-viewer', DocumentViewer);
}
if (!window.customElements.get('form-document-viewer-editor')) {
  window.customElements.define('form-document-viewer-editor', DocumentViewerEditor);
}
