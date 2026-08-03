import { ScCommentItem } from '../src/components/ScComment/components/ScCommentItem/ScCommentItem.js';

export * from '../src/components/ScComment/components/ScCommentItem/ScCommentItem.js';

window.customElements.define('sc-comment-item', ScCommentItem);

declare global {
  interface HTMLElementTagNameMap {
    'sc-comment-item': ScCommentItem;
  }
}
