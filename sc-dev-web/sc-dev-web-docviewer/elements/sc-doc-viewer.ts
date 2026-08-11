import { ScDocViewer } from '../src/components/ScDocViewer.js';
export * from '../src/components/ScDocViewer.js';

window.customElements.define('sc-doc-viewer', ScDocViewer);

declare global {
  interface HTMLElementTagNameMap {
    'sc-doc-viewer': ScDocViewer;
  }
}
