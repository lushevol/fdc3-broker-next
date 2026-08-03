import { ScComment } from '../src/components/ScComment/ScComment.js';

// Import sub-component registrations to ensure they are defined
// when ScComment is used (ScComment depends on these sub-components)
import './sc-comment-input.js';
import './sc-comment-list.js';
import './sc-comment-toolbar.js';
import './sc-comment-load-more.js';

export * from '../src/components/ScComment/ScComment.js';

window.customElements.define('sc-comment', ScComment);

declare global {
  interface HTMLElementTagNameMap {
    'sc-comment': ScComment,
  }
}
