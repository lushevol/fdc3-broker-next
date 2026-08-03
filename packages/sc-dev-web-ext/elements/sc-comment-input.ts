import { ScCommentInput } from '../src/components/ScComment/components/ScCommentInput/ScCommentInput.js';

export * from '../src/components/ScComment/components/ScCommentInput/ScCommentInput.js';

window.customElements.define('sc-comment-input', ScCommentInput);

declare global {
  interface HTMLElementTagNameMap {
    'sc-comment-input': ScCommentInput;
  }
}
