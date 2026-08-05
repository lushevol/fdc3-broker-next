import { ScPDFViewer } from '../src/components/ScPDFViewer.js';
export * from '../src/components/ScPDFViewer.js';

window.customElements.define('sc-pdf-viewer', ScPDFViewer);

declare global {
  interface HTMLElementTagNameMap {
    'sc-pdf-viewer': ScPDFViewer;
  }
}
