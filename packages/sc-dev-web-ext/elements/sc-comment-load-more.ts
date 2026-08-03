import { ScCommentLoadMore } from '../src/components/ScComment/components/ScCommentLoadMore/ScCommentLoadMore.js';

export * from '../src/components/ScComment/components/ScCommentLoadMore/ScCommentLoadMore.js';

window.customElements.define('sc-comment-load-more', ScCommentLoadMore);

declare global {
  interface HTMLElementTagNameMap {
    'sc-comment-load-more': ScCommentLoadMore;
  }
}
