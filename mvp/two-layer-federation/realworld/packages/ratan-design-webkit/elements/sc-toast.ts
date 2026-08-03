import { ScToast } from '../src/components/ScToast/ScToast.js';
export * from '../src/components/ScToast/ScToast.js';

if (!window.customElements.get('sc-toast')) window.customElements.define('sc-toast', ScToast);

declare global {
  interface HTMLElementTagNameMap {
    'sc-toast': ScToast;
  }
}
