import { ScCommentAttachments } from '../src/components/ScComment/components/ScCommentAttachments/ScCommentAttachments.js';

export * from '../src/components/ScComment/components/ScCommentAttachments/ScCommentAttachments.js';

window.customElements.define('sc-comment-attachments', ScCommentAttachments);

declare global {
  interface HTMLElementTagNameMap {
    'sc-comment-attachments': ScCommentAttachments;
  }
}
