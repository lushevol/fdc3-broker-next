import { html, nothing, PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import DOMPurify from 'dompurify';
import { msg } from '../../../../i18n/localization.js';
import ScExtElement from '../../../../shared/sc-ext-element.js';
import ScCommentItemStyle from './ScCommentItem.style.js';
import dayjs from 'dayjs/esm/index.js';
import relativeTime from 'dayjs/esm/plugin/relativeTime/index.js';
import { none } from '../../ScComment.constants.js';
import type { CommentBaseDemand, UserInfo, Action } from '../../ScComment.types.js';
import { preventDefault } from '../../../../shared/event.js';

dayjs.extend(relativeTime);

/**
 * ScCommentItem - Single comment display with actions
 * 
 * @fires sc-reply - User clicked Reply button
 * @fires sc-edit - User clicked Edit button
 * @fires sc-delete-request - User clicked Delete button
 * @fires sc-comment-like - User clicked Like button
 * @fires sc-comment-share - User clicked Share button
 * @fires sc-comment-report - User clicked Report button
 * @fires sc-action-trigger - User clicked custom action
 * @fires sc-hover - Mouse entered comment
 * @fires sc-hover-end - Mouse left comment
 * 
 * @slot default - Content for nested replies
 */
export class ScCommentItem extends ScExtElement {
  static styles = [ScCommentItemStyle];

  @property({ type: Object }) comment!: CommentBaseDemand;
  @property({ type: Object }) userInfo!: UserInfo;
  @property({ type: Object }) parentUser?: UserInfo;
  @property({ type: Object }) firstChildComment?: CommentBaseDemand | undefined;
  @property({ type: Number }) depth = 0;
  @property({ type: Number }) maxReplyDepth = 5;
  @property({ type: Boolean }) enableLike = false;
  @property({ type: Boolean }) enableShare = false;
  @property({ type: Boolean }) enableReport = false;
  @property({ type: Boolean }) enableEdit = false;
  @property({ type: Boolean }) enableReminder = false;
  @property({ type: Boolean }) enableMark = false;
  @property({ type: Boolean }) enableDelete = false;
  @property({ type: Boolean }) disableFileDownload = false;
  @property({ type: Boolean }) compact = false;
  @property({ type: Boolean }) hideAvatar = false;
  @property({ type: Array }) actions: Action[] = [];
  @property({ type: Array }) moreActions: Array<{
    label: string | Element | TemplateResult | (() => string | Element | TemplateResult);
    value: string;
  }> = [];
  @property({ type: Boolean }) isEditing = false;
  @property({ type: Boolean }) isHovered = false;
  @property({ type: Boolean }) readonly = false;

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.startFirstMediaQuery();
  }

  getRelativeTime(createdAt: Date, updatedAt?: Date) {
    const date = dayjs(updatedAt || createdAt);
    const now = dayjs();
    const diffSeconds = now.diff(date, 'second');
    const diffMinutes = now.diff(date, 'minute');
    const diffHours = now.diff(date, 'hour');
    const diffDays = now.diff(date, 'day');

    const isCompact = this.compact || this.isMobile;

    if (diffSeconds < 60) {
      return msg('Just now', { id: 'sc-comment-time-just-now' });
    } else if (diffMinutes < 60) {
      return isCompact
        ? `${diffMinutes}${msg('m ago', { id: 'sc-comment-time-minutes-ago-short' })}`
        : `${diffMinutes} ${msg('mins ago', { id: 'sc-comment-time-minutes-ago' })}`;
    } else if (diffHours < 24) {
      return `${diffHours}${msg('hr ago', { id: 'sc-comment-time-hours-ago' })}`;
    } else {
      return isCompact
        ? `${diffDays}${msg('d ago', { id: 'sc-comment-time-days-ago-short' })}`
        : `${diffDays} ${msg('days ago', { id: 'sc-comment-time-days-ago' })}`;
    }
  }

  handleReplyClick = () => {
    this.emit('sc-reply', {
      detail: { comment: this.comment },
    });
  };

  handleEditClick = () => {
    this.emit('sc-edit', {
      detail: { comment: this.comment },
    });
  };

  handleDeleteClick = () => {
    this.emit('sc-delete-request', {
      detail: { comment: this.comment },
    });
  };

  handleLikeClick = () => {
    this.emit('sc-comment-like', {
      detail: { comment: this.comment },
    });
  };

  handleShareClick = () => {
    this.emit('sc-comment-share', {
      detail: { comment: this.comment },
    });
  };

  handleReportClick = () => {
    this.emit('sc-comment-report', {
      detail: { comment: this.comment },
    });
  };

  handleActionTrigger = (e: CustomEvent) => {
    this.emit('sc-action-trigger', {
      detail: {
        value: e.detail.value,
        comment: this.comment,
      },
    });
  };

  handleMouseOver() {
    this.isHovered = true;
    this.emit('sc-hover', {
      detail: { commentId: this.comment.id },
    });
  }

  handleMouseOut() {
    this.isHovered = false;
    this.emit('sc-hover-end', {
      detail: { commentId: this.comment.id },
    });
  }

  handleAttachmentDownload(e: CustomEvent) {
    // Forward event to parent
    this.emit('sc-attachment-download', {
      detail: e.detail,
    });
  }

  handleAttachmentPreview(e: CustomEvent) {
    this.emit('sc-attachment-preview', {
      detail: e.detail,
    });
  }

  /**
   * Renders comment text, replacing sc-mention spans with sc-employee-name components
   * so that mentions display as styled employee name links instead of plain text.
   */
  private renderCommentText(text: string) {
    const sanitized = DOMPurify.sanitize(text, {
      ADD_ATTR: ['data-mention-id', 'data-mention-name'],
    });
    // Replace <span class="sc-mention" data-mention-id="ID" ...>@NAME</span>
    // with <sc-employee-name id="ID"></sc-employee-name>
    const processed = sanitized.replace(
      /<span[^>]*data-mention-id="([^"]*?)"[^>]*>[^<]*<\/span>/g,
      '<sc-employee-name id="$1"></sc-employee-name>'
    );
    return unsafeHTML(processed);
  }

  loadUserInfo(e: CustomEvent, comment: CommentBaseDemand) {
    const detail = {
      data: e.detail.data, 
      comment,
    };
    this.emit('sc-userinfo-load', {
      detail,
    });
  }

  render() {
    const { comment, depth, maxReplyDepth, isEditing } = this;
    const leftIconRightTextStyle = {
      display: 'flex',
      gap: '0.5rem',
    };
    const compactActions = [];

    const replyBtn = depth + 1 < maxReplyDepth && !this.readonly ? html`
      <div class="action-button">
        <div class="left-icon-right-text" style=${styleMap(leftIconRightTextStyle)} @click=${this.handleReplyClick}>
          <sc-icon name="message-circle--line" size="sm"></sc-icon>
          <span>${msg('Reply', { id: 'sc-comment-reply' })}</span>
        </div>
      </div>
    ` : nothing;

    const likes = comment.likes ?? 0;
    const likeText = likes > 1 ? 'Likes' : 'Like';
    const likedByCurrentUser = comment.likedByCurrentUser || false;
    const icon1 = html`<sc-icon name="heart--line" size="sm"></sc-icon>`;
    const icon2 = html`
      <sc-icon
        style="color: var(--sc-comment-action-button-color);"
        name="heart--fill"
        size="sm"
      ></sc-icon>
    `;
    
    const likeBtn = this.enableLike ? html`
      <div class="action-button">
        <div class="left-icon-right-text" style=${styleMap(leftIconRightTextStyle)} @click=${this.handleLikeClick}>
          ${likedByCurrentUser ? icon2 : icon1}
          <span>${likes} ${msg(likeText, { id: 'sc-comment-like' })}</span>
        </div>
      </div>
    ` : nothing;

    const shareBtn = this.enableShare ? html`
      <div class="action-button">
        <div class="left-icon-right-text" style=${styleMap(leftIconRightTextStyle)} @click=${this.handleShareClick}>
          <sc-icon name="share--line" size="sm"></sc-icon>
          <span>${msg('Share', { id: 'sc-comment-share' })}</span>
        </div>
      </div>
    ` : nothing;

    const reportBtn = this.enableReport ? html`
      <div class="action-button">
        <div class="left-icon-right-text" style=${styleMap(leftIconRightTextStyle)} @click=${this.handleReportClick}>
          <sc-icon name="flag--line" size="sm"></sc-icon>
          <span>${msg('Report', { id: 'sc-comment-report' })}</span>
        </div>
      </div>
    ` : nothing;

    const isAuthor = comment.user.bankid === this.userInfo.bankid;
    const canEdit = this.enableEdit && isAuthor;
    const editBtn = canEdit ? html`
      <div class="action-button">
        <div class="left-icon-right-text" style=${styleMap(leftIconRightTextStyle)} @click=${this.handleEditClick}>
          <sc-icon name="edit--line" size="sm"></sc-icon>
          <span>${msg('Edit', { id: 'sc-comment-edit' })}</span>
        </div>
      </div>
    ` : nothing;

    const canRemind = this.enableReminder && isAuthor && comment?.reminderAt;
    const remindBtn = canRemind ? html`
      <div class="action-button">
        <div class="left-icon-right-text" style=${styleMap(leftIconRightTextStyle)}>
          <sc-tooltip
            slot="top-right"
            content-max-width=400px
            content="${msg('Reminder set at ', { id: 'sc-comment-set-reminder-set-at' })}${comment.reminderAt ? dayjs(comment.reminderAt).format('DD MMM YYYY HH:mm') : ''}"
            trigger="hover"
          >
            <sc-icon name="timer-clock--line" size="sm"></sc-icon>
          </sc-tooltip>
        </div>
      </div>
    ` : nothing;

    const customizedActions = this.actions.map(action => html`
      <div class="action-button">
        <div class="left-icon-right-text" style=${styleMap(leftIconRightTextStyle)} @click=${() => action.handler(comment)}>
          <sc-icon .name=${action.icon} size="sm"></sc-icon>
          <span>${action.label}</span>
        </div>
      </div>
    `);

    if (this.compact || this.isMobile) {
      if (this.enableLike) {
        compactActions.push({
          label: () => likeBtn,
          value: 'like',
        });
      }
      if (canEdit) {
        compactActions.push({
          label: () => editBtn,
          value: 'edit',
        });
      }
      if (this.enableShare) {
        compactActions.push({
          label: () => shareBtn,
          value: 'share',
        });
      }
      if (this.enableReport) {
        compactActions.push({
          label: () => reportBtn,
          value: 'report',
        });
      }
      if (customizedActions?.length) {
        customizedActions.map((ca, index) => {
          compactActions.push({
            label: () => ca,
            value: `custom-${  index}`,
          });
        });
      }
    }
    // class="reply-container ${depth !== 0 && (this.compact || this.isMobile) ? 'compact show-line' : `default ${this.firstChildComment?.id !== comment.id ? 'show-line' : ''}`} ${depth === 0 ? `top-level ${this.hideAvatar ? 'no-avatar' : ''}` : ''}"
    const replyContainerClass = {
      'reply-container': true,
      // depth > 0 in compact/mobile mode
      compact: depth !== 0 && (this.compact || this.isMobile),
      'show-line': depth !== 0 && (this.compact || this.isMobile)
        || (depth === 0 ? false : this.firstChildComment?.id !== comment.id),
      // depth === 0 default mode
      default: !(depth !== 0 && (this.compact || this.isMobile)),
      // top-level
      'top-level': depth === 0,
      'no-avatar': depth === 0 && this.hideAvatar,
    };
    
    // class="reply-avatar-container ${depth !== 0 && (this.compact || this.isMobile) ? `compact ${this.firstChildComment?.id !== comment.id ? 'show-line' : ''}` : ''} ${depth === 0 ? `top-level ${this.hideAvatar ? 'no-avatar' : ''}` : ''}"
    const replyAvatarContainerClass = {
      'reply-avatar-container': true,
      // depth > 0 in compact/mobile mode
      compact: depth !== 0 && (this.compact || this.isMobile),
      // show-line only when compact/mobile AND not the first child comment
      'show-line': depth !== 0 && (this.compact || this.isMobile) && this.firstChildComment?.id !== comment.id,
      // top-level
      'top-level': depth === 0,
      'no-avatar': depth === 0 && this.hideAvatar,
    };

    const placeholderClass = {
      [`reply-input-placeholder-${comment.id}`]: true,
    };

    // class="reply-children ${this.hideAvatar ? 'no-avatar' : ''}"
    const replyChildrenContainerClass = {
      'reply-children': true,
      'no-avatar': this.hideAvatar,
      compact: this.compact || this.isMobile,
    };

    const hasActions = this.moreActions.length > 0;
    const canShowMore = isAuthor;
    const actionStyle = {
      display: canShowMore && hasActions ? 'inline' : 'none',
      '--sc-dropdown-min-width': '11rem',
      '--sc-popup-max-height': '18.75rem',
      cursor: 'pointer',
      position: 'absolute',
      top: '0.125rem',
      right: '-0.5rem',
    };

    const editingStyle = isEditing ? none : {};
    const replyMoreClass = {
      'reply-more-hide': !this.isHovered,
      'reply-more': true,
    };

    const statusLabel =
      comment.status === 'need-clarification'
        ? msg('Need clarification', { id: 'sc-comment-status-need-clarification' })
        : comment.status === 'in-progress'
        ? msg('In progress', { id: 'sc-comment-status-in-progress' })
        : comment.status === 'resolved'
        ? msg('Resolved', { id: 'sc-comment-status-resolved' })
        : comment.status === 'critical'
        ? msg('Critical', { id: 'sc-comment-status-critical' })
        : '';
    const badgeLabel = statusLabel;
    const badgeClass = {
      'comment-status-badge': true,
      'comment-status-badge--need-clarification': comment.status === 'need-clarification',
      'comment-status-badge--in-progress': comment.status === 'in-progress',
      'comment-status-badge--resolved': comment.status === 'resolved',
      'comment-status-badge--critical': comment.status === 'critical',
    };
    const avatarTemplate = html`
      <sc-employee-avatar
        class="comment-avatar ${this.hideAvatar ? 'hide-avatar' : ''}"
        id=${comment.user.bankid}
        avatar-size="md"
        @sc-loaded=${(e:CustomEvent)=>{ this.loadUserInfo(e,comment); }}
      ></sc-employee-avatar>
    `;
    const replyUsername = depth !== 0 && (this.compact || this.isMobile) && this.parentUser ? html`
      <div>
        <span class="reply-username compact">${comment.user.name || '-'}</span>
        <span class="reply-username"> to </span>
        <span class="reply-username compact">${this.parentUser.name || '-'}</span>
      </div>
    ` : html`
      <div class="reply-username-container">
        <span class="reply-username">${comment.user.name || '-'}</span>
        ${depth === 0 && badgeLabel && (this.compact || this.isMobile)
        ? html`<span class=${classMap(badgeClass)}>${badgeLabel}</span>`
        : nothing}
      </div>
    `;

    return html`
      <div class=${classMap(replyContainerClass)}>
        <div class=${classMap(replyAvatarContainerClass)}>
          ${avatarTemplate}
        </div>
        <div class="reply-content-container">
        ${canShowMore 
          ? html`
              <div
                class=${classMap(replyMoreClass)}
                @mouseover=${this.handleMouseOver}
                @mouseout=${this.handleMouseOut}
              >
                <sc-dropdown-input
                  size="md"
                  .data=${this.moreActions}
                  style=${styleMap(actionStyle)}
                  @sc-select=${this.handleActionTrigger}
                >
                  <div slot="trigger">
                    <sc-icon style="cursor: pointer;" name="more-horizontal" size="sm"></sc-icon>
                  </div>
                </sc-dropdown-input>
              </div>
            `
          : nothing}
          <div
            class="reply-content-inner"
            @mouseover=${this.handleMouseOver}
            @mouseout=${this.handleMouseOut}
          >
            ${replyUsername}
            <div class="reply-text" style=${styleMap(editingStyle)}>
              ${this.renderCommentText(comment.text)}
            </div>
            ${comment.attachments && comment.attachments.length > 0 && !isEditing
              ? html`
                  <sc-comment-attachments
                    .attachments=${comment.attachments}
                    .commentId=${comment.id}
                    .enableDownload=${!this.disableFileDownload}
                    @sc-attachment-download=${this.handleAttachmentDownload}
                    @sc-attachment-preview=${this.handleAttachmentPreview}
                  ></sc-comment-attachments>
                `
              : nothing}
            <div class="reply-more-actions" style=${styleMap(editingStyle)}>
              <div class="reply-time">
                ${this.getRelativeTime(comment.createdAt, comment.updatedAt)}
              </div>
              ${badgeLabel && !(this.compact || this.isMobile)
                ? html`<span class=${classMap(badgeClass)}>${badgeLabel}</span>`
                : nothing}
              ${
                this.compact || this.isMobile ? html`
                  <div class=action-container>
                    ${replyBtn}
                    <div style='position: relative'>
                      <sc-dropdown-input
                          style="
                            --sc-dropdown-min-width: 200px;
                            cursor: pointer;
                            position: absolute;
                            top: 2px;
                            color: var(--sc-comment-action-button-color, var(--sc-color-blue-500));
                          "
                          @click=${preventDefault}
                          @mousedown=${preventDefault}
                          class="actions"
                          .data=${compactActions}
                        >
                          <sc-icon
                            slot="trigger"
                            name="more-horizontal"
                          ></sc-icon>
                        </sc-dropdown-input>
                    </div>
                  </div>
                ` : html`
                  ${replyBtn} ${likeBtn} ${editBtn} ${shareBtn} ${reportBtn} ${customizedActions} ${remindBtn}
                `
              }
            </div>
          </div>
          <div class=${classMap(placeholderClass)}></div>
        </div>
        
        <div class=${classMap(replyChildrenContainerClass)} style="--sc-comment-nest-level: ${depth + 1};">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
