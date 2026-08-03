import { Modal } from './Modal.js';
import { ModalEditor } from './ModalEditor.js';

if (!window.customElements.get('form-modal')) {
  window.customElements.define('form-modal', Modal);
}
if (!window.customElements.get('form-modal-editor')) {
  window.customElements.define('form-modal-editor', ModalEditor);
}
