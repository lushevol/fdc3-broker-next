import { ScCopy } from '../src/components/ScCopy/ScCopy.js';
export * from '../src/components/ScCopy/ScCopy.js';

window.customElements.define('sc-copy', ScCopy);

declare global {
  interface HTMLElementTagNameMap {
    'sc-copy': ScCopy
  }
}