import { ScDocumentImageViewer } from '../src/components/ScDocumentImageViewer/ScDocumentImageViewer.js';
import '../elements/sc-divider.js';
import '../elements/sc-icon-button.js';
import '../elements/sc-icon.js';
import '../elements/sc-button.js';
export * from '../src/components/ScDocumentImageViewer/ScDocumentImageViewer.js';

window.customElements.define('sc-document-image-viewer', ScDocumentImageViewer);

declare global {
  interface HTMLElementTagNameMap {
    'sc-document-image-viewer': ScDocumentImageViewer;
  }
}
