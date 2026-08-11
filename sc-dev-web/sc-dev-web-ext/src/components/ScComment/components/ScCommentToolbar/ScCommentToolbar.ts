import { html, nothing, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import { msg } from '../../../../i18n/localization.js';
import ScExtElement from '../../../../shared/sc-ext-element.js';
import ScCommentToolbarStyle from './ScCommentToolbar.style.js';

/**
 * ScCommentToolbar - Filter and sort controls for comment lists
 *
 * @fires sc-filter-change - Emitted when poster (view) selection changes
 * @fires sc-sort-change - Emitted when sorter selection changes
 * @fires sc-view-sort-change - Always emitted on any view/sort change; carries { poster, sorter }
 */
export class ScCommentToolbar extends ScExtElement {
  static styles = [ScCommentToolbarStyle];

  @property({ type: Number }) commentCount = 0;
  @property({ type: String }) currentPoster = 'all';
  @property({ type: String }) currentSorter = 'newest';
  @property({ type: Array }) viewOptions: Array<{ label: string; value: string }> = [];
  @property({ type: Array }) sortOptions: Array<{ label: string; value: string }> = [];
  /**
   * When false (default): filtering/sorting is done internally by the component (client mode).
   * When true: the component emits sc-view-sort-change and leaves data management to the host (server/manual mode).
   */
  @property({ type: Boolean, attribute: 'manual-sorting' }) manualSorting = false;
  @property({ type: Boolean }) hideViewCondition = false;
  @property({ type: Boolean }) hideSortBy = false;
  @property({ type: Boolean }) compact = false;

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.startFirstMediaQuery();
  }
  
  handlePosterChange(e: CustomEvent) {
    const value = e.detail.value;
    // In client mode skip if unchanged; in server/manual mode always emit since internal state is not updated
    if (!this.manualSorting && this.currentPoster === value) {
      return;
    }
    if (!this.manualSorting) {
      this.currentPoster = value;
    }
    this.emit('sc-filter-change', {
      detail: {
        poster: value,
      },
    });
    this.emit('sc-view-sort-change', {
      detail: {
        poster: value,
        sorter: this.currentSorter,
      },
    });
  }

  handleSorterChange(e: CustomEvent) {
    const value = e.detail.value;
    if (!this.manualSorting && this.currentSorter === value) {
      return;
    }
    if (!this.manualSorting) {
      this.currentSorter = value;
    }
    this.emit('sc-sort-change', {
      detail: {
        sorter: value,
      },
    });
    this.emit('sc-view-sort-change', {
      detail: {
        poster: this.currentPoster,
        sorter: value,
      },
    });
  }

  render() {
    const hasMultipleComments = this.commentCount > 1;
    const howManyCommentsMsg = `${this.commentCount} ${msg(
      hasMultipleComments ? 'comments' : 'comment',
      {
        id: 'sc-comment-comments',
      }
    )}`;

    return html`
      <div class="condition-wrapper ${this.compact || this.isMobile ? 'compact' : ''}">
        <div class="comments-count">${howManyCommentsMsg}</div>
        <div class="condition-right">
          ${this.hideViewCondition
            ? nothing
            : html`
              <div class="poster">
                <span>${msg('View', { id: 'sc-comment-view' })}</span>
                <sc-dropdown-input
                  @sc-select=${this.handlePosterChange}
                  size="md"
                  .data=${this.viewOptions}
                  .value=${this.currentPoster}
                >
                </sc-dropdown-input>
              </div>
            `}

          ${this.hideSortBy
            ? nothing
            : html`
              <div class="sorter">
                <span>${msg('Sort by', { id: 'sc-comment-sort-by' })}</span>
                <sc-dropdown-input
                  size="md"
                  .data=${this.sortOptions}
                  @sc-select=${this.handleSorterChange}
                  .value=${this.currentSorter}
                >
                </sc-dropdown-input>
              </div>
            `}
        </div>
      </div>
    `;
  }
}
