import { ScCommentToolbar } from '../src/components/ScComment/components/ScCommentToolbar/ScCommentToolbar.js';

export * from '../src/components/ScComment/components/ScCommentToolbar/ScCommentToolbar.js';

window.customElements.define('sc-comment-toolbar', ScCommentToolbar);

declare global {
  interface HTMLElementTagNameMap {
    'sc-comment-toolbar': ScCommentToolbar;
  }
}
