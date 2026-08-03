import { ScModal } from '../src/components/ScModal/ScModal.js';
export * from '../src/components/ScModal/ScModal.js';

if (!window.customElements.get('sc-modal')) window.customElements.define('sc-modal', ScModal);

declare global {
  interface HTMLElementTagNameMap {
    'sc-modal': ScModal;
  }
}
