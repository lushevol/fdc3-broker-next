import { ScModal } from '../src/components/ScModal/ScModal.js';
export * from '../src/components/ScModal/ScModal.js';

window.customElements.define('sc-modal', ScModal);

declare global {
  interface HTMLElementTagNameMap {
    'sc-modal': ScModal;
  }
}
