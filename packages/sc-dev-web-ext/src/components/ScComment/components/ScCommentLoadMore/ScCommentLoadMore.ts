import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { msg } from '../../../../i18n/localization.js';
import ScExtElement from '../../../../shared/sc-ext-element.js';
import ScCommentLoadMoreStyle from './ScCommentLoadMore.style.js';

/**
 * ScCommentLoadMore - Load more comments button
 *
 * Only renders when `totalCount` exceeds the visibility threshold (20).
 * Shows a loading spinner when `loading` is true.
 *
 * @fires sc-load-more - User clicked the load more button
 */
export class ScCommentLoadMore extends ScExtElement {
  static styles = [ScCommentLoadMoreStyle];

  /** Total number of comment items currently visible in the UI. */
  @property({ type: Number }) totalCount = 0;

  /** Whether a load-more request is currently in flight. */
  @property({ type: Boolean }) loading = false;
  @property({ type: Number }) requestPageSize = 20;
  @property({ type: Number }) requestPageNumber = 0;

  private handleClick() {
    if (this.loading) return;
    this.emit('sc-load-more', { detail: { totalCount: this.totalCount, page: this.requestPageNumber, size: this.requestPageSize } });
  }

  render() {
    return html`
      <div class="load-more-wrapper">
        <sc-link
          class="load-more-link${this.loading ? ' load-more-link--loading' : ''}"
          @click=${this.handleClick}
        >
          ${this.loading
            ? html`<sc-spinner size="md"></sc-spinner>`
            : html`
                <span>${msg('Load more', { id: 'sc-comment-load-more' })}</span>
                <sc-icon name="arrow-ios-downward" size="md"></sc-icon>
              `}
        </sc-link>
      </div>
    `;
  }
}
