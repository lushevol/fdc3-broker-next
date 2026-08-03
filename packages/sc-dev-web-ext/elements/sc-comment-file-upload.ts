import { ScCommentFileUpload } from '../src/components/ScComment/components/ScCommentFileUpload/ScCommentFileUpload.js';

export * from '../src/components/ScComment/components/ScCommentFileUpload/ScCommentFileUpload.js';

window.customElements.define('sc-comment-file-upload', ScCommentFileUpload);

declare global {
  interface HTMLElementTagNameMap {
    'sc-comment-file-upload': ScCommentFileUpload;
  }
}
