import { ScCommentList } from '../src/components/ScComment/components/ScCommentList/ScCommentList.js';

export * from '../src/components/ScComment/components/ScCommentList/ScCommentList.js';

window.customElements.define('sc-comment-list', ScCommentList);

declare global {
  interface HTMLElementTagNameMap {
    'sc-comment-list': ScCommentList;
  }
}
