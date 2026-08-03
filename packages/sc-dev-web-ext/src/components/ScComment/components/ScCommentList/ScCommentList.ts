import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit-html/directives/repeat.js';
import { msg } from '../../../../i18n/localization.js';
import ScExtElement from '../../../../shared/sc-ext-element.js';
import ScCommentListStyle from './ScCommentList.style.js';
import type { CommentBaseDemand, UserInfo, Action, CommentAction } from '../../ScComment.types.js';
import { styleMap } from 'lit/directives/style-map.js';
import { deleteActionLabel, moreActionsStyle, reminderActionLabel, markActionLabel } from '../../ScComment.constants.js';
import { watch } from '../../../../shared/watch.js';

/**
 * ScCommentList - Recursive comment list renderer
 * 
 * @fires sc-reply - User clicked Reply on a comment
 * @fires sc-edit - User clicked Edit on a comment
 * @fires sc-delete-request - User requested delete
 * @fires sc-comment-like - User liked a comment
 * @fires sc-comment-share - User shared a comment
 * @fires sc-comment-report - User reported a comment
 * @fires sc-toggle-replies - User toggled replies visibility
 * @fires sc-action-trigger - User triggered custom action
 * @fires sc-hover - Mouse entered comment
 * @fires sc-hover-end - Mouse left comment
 * @fires sc-attachment-download - User downloaded attachment
 * @fires sc-attachment-preview - User previewed attachment
 */
export class ScCommentList extends ScExtElement {
  static styles = [ScCommentListStyle];

  @property({ type: Array }) comments: CommentBaseDemand[] = [];
  @property({ type: Array }) singleRequestComments: CommentBaseDemand[] = [];
  @property({ type: Number }) requestPageSize = 20;
  @property({ type: Number }) requestPageNumber = 0;
  @property({ type: Object }) userInfo!: UserInfo;
  @property({ type: Number }) maxReplyDepth = 5;
  @property({ type: Number }) maxVisibleReplies = 5;
  @property({ type: Boolean }) enableLike = false;
  @property({ type: Boolean }) enableShare = false;
  @property({ type: Boolean }) enableReport = false;
  @property({ type: Boolean }) enableEdit = false;
  @property({ type: Boolean }) enableDelete = false;
  @property({ type: Boolean }) disableFileDownload = false;
  @property({ type: Array }) actions: Action[] = [];
  @property({ type: Array }) moreActions: CommentAction[] = [];
  @property({ type: String }) activeCommentId?: string;
  @property({ type: String }) activeEditCommentId?: string;
  @property({ type: Object }) repliesExpanded: Record<string, boolean> = {};
  @property({ type: String }) hoveringCommentId?: string;
  @property({ type: Object }) fileHandler?: any;
  @property({ type: Boolean }) enableUpload = false;
  @property({ type: Boolean }) singleFileUpload = false;
  @property({ type: Number }) maxFilesPerComment = 5;
  @property({ type: String }) acceptedFileTypes = '';
  @property({ type: Boolean }) enableReminder = false;
  @property({ type: Boolean }) enableMark = false;
  @property({ type: Boolean }) hideAvatar = false;
  @property({ type: Boolean }) requestLoading = false;
  @property({ type: String }) replyInputMode?: 'reply' | 'edit';
  @property({ type: String }) replyInputValue = '';
  @property({ type: Object }) replyInputComment?: any;
  @property({ type: Array }) toolbar: Array<any> = [];
  @property({ type: Boolean }) compactReplyMode = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean }) compact = false;
  @property({ type: Boolean }) loadMoreLoading = false;

  /**
   * Per-comment draft texts keyed by commentId.
   * Passed from ScComment so the list can restore draft text after a collapse.
   */
  @property({ type: Object }) draftTexts: Record<string, string> = {};

  /** Per-comment in-session compact input values (updated as user types). */
  @state() private compactInputValues: Record<string, string> = {};

  @watch(['compactReplyMode', 'comments'])
  updateView() {
    this.requestUpdate();
  }

  findFirstChildComment(comments: CommentBaseDemand[]): CommentBaseDemand | undefined {
    if (!comments || comments.length === 0) {
      return undefined;
    }
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      if (comment) {
        return comment;
      }
    }
    return undefined;
  }

  handleToggleReplies(parentID: string, comments: CommentBaseDemand[]) {
    this.emit('sc-toggle-replies', {
      detail: {
        commentId: parentID,
        comments,
      },
    });
  }

  /**
   * Generate more actions menu items for a specific comment
   * Only show delete option if user is author and delete is enabled
   */
  getCommentMoreActions(comment: CommentBaseDemand, depth: number): Array<any> {
    const isAuthor = comment.user.bankid === this.userInfo.bankid;
    const canDelete = this.enableDelete && isAuthor;
    const actions = this.moreActions.map(action => ({
      value: action.id,
      label: action.icon
        ? html`<div style=${styleMap(moreActionsStyle)} class="more-actions-item">
            <sc-icon name=${action.icon} size="sm"></sc-icon>
            <span>${action.label}</span>
          </div>`
        : action.label,
    }));


    if (depth === 0 && this.enableReminder && !actions.some(a => a.value === 'reminder')) {
      actions.push({
        value: 'reminder',
        label: reminderActionLabel(),
      });
    }

    if (depth === 0 && this.enableMark && !actions.some(a => a.value === 'mark')) {
      actions.push({
        value: 'mark',
        label: markActionLabel(),
      });
    }
    
    if (canDelete && !actions.some(a => a.value === 'delete')) {
      actions.push({
        value: 'delete',
        label: deleteActionLabel(),
      });
    }

    return actions;
  }

  renderToggleRepliesButton(comments: CommentBaseDemand[]) {
    const parentID = comments[0].parentID as string;
    const expanded = this.repliesExpanded[parentID];
    const hiddenCount = comments.length - this.maxVisibleReplies;
    const replyWord = hiddenCount === 1 ? 'reply' : 'replies';

    return html`
      <div
        class="toggle-replies-button"
        @click=${() => this.handleToggleReplies(parentID, comments)}
      >
        <span>${expanded ? 'Hide' : 'Show'}</span>
        <span>${hiddenCount}</span>
        <span>${replyWord}</span>
        <sc-icon name=${expanded ? 'chevron-up' : 'chevron-down'} size="sm"></sc-icon>
      </div>
    `;
  }

  renderReplies(comments: CommentBaseDemand[], depth = 0, parentUser?: UserInfo, payload?: any): unknown {
    if (depth >= this.maxReplyDepth) {
      return nothing;
    }

    const isRoot = depth === 0;
    let visibleComments = comments;
    let hasMore = false;

    if (!isRoot && comments.length > this.maxVisibleReplies) {
      const parentID = comments[0].parentID as string;
      if (this.repliesExpanded[parentID]) {
        visibleComments = comments;
      } else {
        visibleComments = comments.slice(0, this.maxVisibleReplies);
      }
      hasMore = true;
    }

    const replies = repeat(
      visibleComments,
      comment => comment.id,
      comment => this.renderComment(comment, depth, parentUser, payload)
    );

    return html`
      ${replies}
      ${hasMore ? this.renderToggleRepliesButton(comments) : nothing}
    `;
  }

  renderComment(comment: CommentBaseDemand, depth: number, parentUser?: UserInfo, payload?:any) {
    let { firstChildComment } = payload || {};
    const isEditing = this.activeEditCommentId === comment.id;
    const isHovered = this.hoveringCommentId === comment.id;
    const commentMoreActions = this.getCommentMoreActions(comment, depth);
    if (depth === 0) {
      firstChildComment = this.findFirstChildComment(comment.replies);
    }
    
    
    return html`
      <sc-comment-item
        .comment=${comment}
        .userInfo=${this.userInfo}
        .firstChildComment=${firstChildComment}
        .parentUser=${parentUser}
        .depth=${depth}
        .maxReplyDepth=${this.maxReplyDepth}
        .enableLike=${this.enableLike}
        .enableShare=${this.enableShare}
        .enableReport=${this.enableReport}
        .enableEdit=${this.enableEdit && !this.readonly}
        .enableDelete=${this.enableDelete && !this.readonly}
        .disableFileDownload=${this.disableFileDownload}
        ?enableReminder=${this.enableReminder}
        ?enableMark=${this.enableMark}
        .actions=${this.actions}
        .moreActions=${commentMoreActions}
        .isEditing=${isEditing}
        .isHovered=${isHovered}
        ?compact=${this.compact}
        ?hideAvatar=${this.hideAvatar}
        @sc-reply=${this.handleForward}
        @sc-edit=${this.handleForward}
        @sc-delete-request=${this.handleForward}
        @sc-comment-like=${this.handleForward}
        @sc-comment-share=${this.handleForward}
        @sc-comment-report=${this.handleForward}
        @sc-action-trigger=${this.handleForward}
        @sc-hover=${this.handleForward}
        @sc-hover-end=${this.handleForward}
        @sc-attachment-download=${this.handleForward}
        @sc-attachment-preview=${this.handleForward}
        @sc-userinfo-load=${this.handleForward}
      >
        <div class="sc-comment-reply-edit-input ${this.compact && depth > 0 ? 'compact' : ''}">
          ${this.renderReplyEditInput(comment)}
        </div>
        ${comment.replies && comment.replies.length > 0
          ? this.renderReplies(comment.replies, depth + 1, comment.user,{
            ...(payload || {}),
            firstChildComment,
          })
          : nothing}
      </sc-comment-item>
    `;
  }

  handleForward(e: CustomEvent) {
    // Forward all events to parent
    this.emit(e.type as any, {
      detail: e.detail,
    });
  }

  updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);

    if (
      changedProperties.has('activeCommentId') ||
      changedProperties.has('activeEditCommentId')
    ) {
      const activeId = this.activeEditCommentId || this.activeCommentId;
      if (!activeId) return;

      // If there's already a live typing value for this comment, keep it.
      // Otherwise fall back to the persisted draft from the parent, then to
      // the comment text (edit mode) or empty string (reply mode).
      if (!(activeId in this.compactInputValues)) {
        const activeComment = this.findCommentById(activeId, this.comments);
        const fallbackValue = this.activeEditCommentId
          ? (this.draftTexts[activeId] ?? (activeComment?.text ?? ''))
          : (this.draftTexts[activeId] ?? '');
        this.compactInputValues = {
          ...this.compactInputValues,
          [activeId]: fallbackValue,
        };
      }
    }
  }

  private stripHtml(input: string): string {
    if (!input) return '';
    const doc = new DOMParser().parseFromString(input, 'text/html');
    return doc.body.textContent ?? '';
  }

  private findCommentById(
    commentId: string,
    comments: CommentBaseDemand[]
  ): CommentBaseDemand | undefined {
    for (const comment of comments) {
      if (comment.id === commentId) return comment;
      if (comment.replies?.length) {
        const found = this.findCommentById(commentId, comment.replies);
        if (found) return found;
      }
    }
    return undefined;
  }

  private handleCompactInputChange(e: CustomEvent, commentId: string) {
    const value = e.detail?.value ?? e.detail?.text ?? '';
    this.compactInputValues = {
      ...this.compactInputValues,
      [commentId]: value,
    };
    // Notify the host so it can persist the draft text for collapse/restore
    this.emit('sc-compact-draft-change', {
      detail: { commentId, value },
    });
  }

  private handleCompactSubmit(
    comment: CommentBaseDemand,
    mode: 'reply' | 'edit',
    value?: string,
    event?: CustomEvent
  ) {
    const commentId = comment?.id || 'root';
    const nextValue = value ?? this.compactInputValues[commentId] ?? '';
    if (!nextValue.trim()) return;
    const files = this.fileHandler?.getDraftAttachments(commentId) ?? [];

    // Clear per-comment value after submit
    const updated = { ...this.compactInputValues };
    delete updated[commentId];
    this.compactInputValues = updated;

    this.emit('sc-submit', {
      detail: {
        ...event?.detail ?? {},
        text: nextValue,
        comment,
        files,
        mode,
      },
    });
  }

  private handleCompactCancel(comment: CommentBaseDemand) {
    const commentId = comment?.id || 'root';
    // Clear per-comment in-session value on explicit cancel
    const updated = { ...this.compactInputValues };
    delete updated[commentId];
    this.compactInputValues = updated;

    this.emit('sc-cancel', {
      detail: {
        comment,
      },
    });
  }

  renderReplyEditInput(comment: any) {
    const isActive = this.activeCommentId === comment.id || this.activeEditCommentId === comment.id;
    if (!isActive || this.readonly) {
      return nothing;
    }

    const mode = this.activeEditCommentId === comment.id ? 'edit' : 'reply';
    const commentId = comment?.id || 'root';
    const baseValue =
      mode === 'edit'
        ? comment.text
        : this.replyInputValue;
    const initialValue = this.draftTexts[commentId] ?? baseValue;

    if (this.compactReplyMode) {
      const isEdit = mode === 'edit';
      const primaryBtnLabel = isEdit
        ? msg('Save', { id: 'sc-comment-save' })
        : msg('Post', { id: 'sc-comment-post' });

      // Use live per-comment value; fallback chain: live → draftTexts (via initialValue)
      const compactValue =
        this.compactInputValues[commentId] ??
        initialValue;

      return html`
        <sc-comment-compact-input
          ?compactReplyMode=${this.compactReplyMode}
          .mode=${mode}
          .comment=${comment}
          .value=${compactValue}
          .placeholder=${
            isEdit
              ? msg('Edit comment', { id: 'sc-comment-edit-placeholder' })
              : msg('Reply', { id: 'sc-comment-reply-placeholder' })
          }
          .primaryLabel=${primaryBtnLabel}
          .cancelLabel=${msg('Cancel', { id: 'sc-comment-cancel' })}
          @sc-compact-change=${(e: CustomEvent) => this.handleCompactInputChange(e, commentId)}
          @sc-submit=${(e: CustomEvent) =>
            this.handleCompactSubmit(comment, mode, e.detail?.value,e)}
          @sc-cancel=${() => this.handleCompactCancel(comment)}
        ></sc-comment-compact-input>
        ${this.enableUpload
          ? html`
              <sc-comment-file-upload
                .commentId=${commentId}
                .fileHandler=${this.fileHandler}
                .singleFileUpload=${this.singleFileUpload}
                .maxFilesPerComment=${this.maxFilesPerComment}
                .acceptedFileTypes=${this.acceptedFileTypes}
                .editMode=${isEdit}
                .existingAttachments=${comment?.attachments || []}
                @sc-files-change=${this.handleForward}
                @sc-file-error=${this.handleForward}
              ></sc-comment-file-upload>
            `
          : nothing}
      `;
    }

    return html`
      <sc-comment-input
        .userInfo=${this.userInfo}
        .mode=${mode}
        .initialValue=${initialValue}
        .comment=${comment}
        .toolbar=${this.toolbar}
        .fileHandler=${this.fileHandler}
        .enableUpload=${this.enableUpload}
        .singleFileUpload=${this.singleFileUpload}
        .maxFilesPerComment=${this.maxFilesPerComment}
        .acceptedFileTypes=${this.acceptedFileTypes}
        .showCancel=${true}
        ?compact=${this.compact}
        ?hideAvatar=${this.hideAvatar}
        @sc-submit=${this.handleForward}
        @sc-cancel=${this.handleForward}
        @sc-close=${this.handleForward}
        @sc-draft-change=${this.handleForward}
        @sc-files-change=${this.handleForward}
        @sc-file-error=${this.handleForward}
      ></sc-comment-input>
    `;
  }

  render() {
    const totalCount = this.comments.length;
    return html`
    ${this.renderReplies(this.comments, 0)}
    ${
      this.singleRequestComments.length === this.requestPageSize
      ? html`<div class="load-more-container">
        <sc-comment-load-more
          .totalCount=${totalCount}
          .requestPageNumber=${this.requestPageNumber}
          .requestPageSize=${this.requestPageSize}
          ?loading=${this.loadMoreLoading}
          @sc-load-more=${this.handleForward}
        ></sc-comment-load-more>
      </div>`   
      : nothing
    }
    ${this.requestLoading ? html`<div class="loading-indicator"><sc-spinner type="component" size="lg" color="blue"></sc-spinner></div>` : nothing}
    `;
  }
}
