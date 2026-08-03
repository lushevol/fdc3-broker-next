import { ScToast } from '../src/components/ScToast/ScToast.js';
export * from '../src/components/ScToast/ScToast.js';

window.customElements.define('sc-toast', ScToast);

declare global {
  interface HTMLElementTagNameMap {
    'sc-toast': ScToast,
  }
}