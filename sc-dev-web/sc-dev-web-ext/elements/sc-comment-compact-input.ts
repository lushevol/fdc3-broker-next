import { ScCommentCompactInput } from '../src/components/ScComment/components/ScCommentCompactInput/ScCommentCompactInput.js';

export * from '../src/components/ScComment/components/ScCommentCompactInput/ScCommentCompactInput.js';

window.customElements.define('sc-comment-compact-input', ScCommentCompactInput);

declare global {
  interface HTMLElementTagNameMap {
    'sc-comment-compact-input': ScCommentCompactInput;
  }
}
