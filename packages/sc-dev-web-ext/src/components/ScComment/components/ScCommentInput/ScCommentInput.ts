import { html, nothing, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { msg } from '../../../../i18n/localization.js';
import ScExtElement from '../../../../shared/sc-ext-element.js';
import ScCommentInputStyle from './ScCommentInput.style.js';
import { commentHeight } from '../../ScComment.constants.js';
import type { UserInfo, Comment } from '../../ScComment.types.js';
import type { ScCommentFileHandler } from '../../ScCommentFileHandler.js';
import { isElementVisible } from '../../utils/tools.js';
/**
 * ScCommentInput - Comment input component with rich text editor and file upload
 * 
 * @fires sc-submit - Emitted when user clicks Post/Reply/Save button
 * @fires sc-cancel - Emitted when user clicks Cancel button
 */
export class ScCommentInput extends ScExtElement {
  static styles = [ScCommentInputStyle];

  @property({ type: Object }) userInfo!: UserInfo;
  @property({ type: String }) mode: 'post' | 'reply' | 'edit' = 'post';
  @property({ type: String }) initialValue = '';
  @property({ type: Object }) comment?: Comment;
  @property({ type: Object }) fileHandler!: ScCommentFileHandler;
  @property({ type: Boolean }) enableUpload = false;
  @property({ type: Boolean }) singleFileUpload = false;
  @property({ type: Number }) maxFilesPerComment = Infinity;
  @property({ type: String }) acceptedFileTypes?: string;
  @property({ type: Boolean }) showCancel = false;
  @property({ type: Boolean }) compact = false;
  @property({ type: Boolean }) hideAvatar = false;
  @property({ type: Array }) toolbar: Array<any> = [];

  @state() private value = '';
  @state() private _mentions: Array<{ id: string; name: string }> = [];
  @state() private _onDocumentClick?: (e: MouseEvent) => void;
  

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.startFirstMediaQuery();
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.value = this.initialValue;
    this._mentions = this.comment?.mentions || [];
    this.addInputListener(type=>{
      if (type === 'inside') {
        return;
      }
      this.handleClose();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeInputListener();
  }

  updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);
    if (changedProperties.has('initialValue')) {
      this.value = this.initialValue;
    }
  }

  /**
   * Listen for clicks inside or outside the comment input. Triggers the callback when clicking outside.
   */
  addInputListener(callback: (type: 'inside' | 'outside') => void) {
    this._onDocumentClick = (e: MouseEvent) => {
      const scRteMentionMenu = document?.querySelector('#sc-rte-mention-menu');
      const inputRoot = this.shadowRoot?.querySelector('.comment-input');
      if (!inputRoot || !callback) return;

      const mentionVisible = isElementVisible(scRteMentionMenu);
      if (mentionVisible) {
        setTimeout(() => callback('inside'), 0);
        return;
      }
      const path = e.composedPath();
      const isInside = path.includes(inputRoot as EventTarget);
      if (!isInside) {
        setTimeout(() => {
          callback('outside');
        }, 0);
      }
      else {
        setTimeout(() => {
          callback('inside');
        }, 0);
      }
    };
    document.addEventListener('mousedown', this._onDocumentClick, true);
  }

  removeInputListener() {
    if (this._onDocumentClick) {
      document.removeEventListener('mousedown', this._onDocumentClick, true);
      this._onDocumentClick = undefined;
    }
  }

  handleValueChange(event: CustomEvent<{ text: string, mentions?: Array<{ id: string; name: string }> }>) {
    event.stopPropagation();
    this.value = event.detail.text;
    this._mentions = event.detail.mentions || [];
    // Notify parent of live draft text changes so that an outside-click collapse
    // can persist the in-progress content for later restoration.
    this.emit('sc-draft-change', {
      detail: {
        commentId: this.comment?.id || 'root',
        value: this.value,
        mode: this.mode,
        mentions: this._mentions,
      },
    });
  }

  handleSubmit() {
    if (!this.value) return;

    const commentId = this.comment?.id || 'root';
    const files = this.fileHandler.getDraftAttachments(commentId);
    this.emit('sc-submit', {
      detail: {
        text: this.value,
        comment: this.comment,
        files,
        mode: this.mode,
        mentions: this._mentions,
      },
    });

    // Clear input after post (but not after edit/reply - parent handles that)
    if (this.mode === 'post') {
      this.value = '';
      this._mentions = [];
    }
  }

  handleCancel() {
    this.emit('sc-cancel', {
      detail: {
        comment: this.comment,
      },
    });
    this.value = '';
    this._mentions = [];
  }

  handleClose() {
    this.emit('sc-close', {
      detail: {
        comment: this.comment,
      },
    });
  }

  handleFileChange(e: CustomEvent) {
    // Forward file events to parent
    this.emit('sc-files-change', {
      detail: e.detail,
    });
  }

  handleFileError(e: CustomEvent) {
    // Forward error events to parent
    this.emit('sc-file-error', {
      detail: e.detail,
    });
  }

  handleAttachmentPreview(e: CustomEvent) {
    this.emit('sc-attachment-preview', {
      detail: e.detail,
    });
  }

  render() {
    const commentId = this.comment?.id || 'root';
    const isEdit = this.mode === 'edit';
    
    const primaryBtnLabel = isEdit
      ? msg('Save', { id: 'sc-comment-save' })
      : msg('Post', { id: 'sc-comment-post' });

    const avatarTemplate = !this.hideAvatar
      ? html`
          <sc-employee-avatar
            class="comment-avatar"
            id=${this.userInfo.bankid}
            avatar-size="md"
          ></sc-employee-avatar>
        `
      : nothing;

    return html`
      <div class="comment-input">
        ${avatarTemplate}
        <div class="input-container">
          <div class="input-style">
            <sc-rich-text-editor-v2
              @sc-change=${this.handleValueChange}
              .toolbar=${this.toolbar}
              .value=${this.value}
              .extConfig=${commentHeight}
              @sc-mention=${(e: any) => {
                this._mentions = e.detail.mentions || [];
              }}
            >
            </sc-rich-text-editor-v2>
            <div class="input-buttons">
              ${this.showCancel
                ? html`
                    <sc-button size="sm" type="secondary" @click=${this.handleCancel}>
                      <div class="left-icon-right-text">
                        <span>${msg('Cancel', { id: 'sc-comment-cancel' })}</span>
                      </div>
                    </sc-button>
                  `
                : nothing}
              ${
                this.compact || this.isMobile ? html`
                  <sc-icon-button
                    ?disabled=${!this.value}
                    size="sm"
                    name=send--fill
                    @click=${this.handleSubmit}
                  ></sc-icon-button>
                ` : html`
                  <sc-button
                    ?disabled=${!this.value}
                    size="sm"
                    @click=${this.handleSubmit}
                  >
                    <div class="left-icon-right-text">
                      <sc-icon name="send--fill" size="sm"></sc-icon>
                      <span>${primaryBtnLabel}</span>
                    </div>
                  </sc-button>
                `
              }
            </div>
          </div>
          ${this.enableUpload
            ? html`
                <sc-comment-file-upload
                  .commentId=${commentId}
                  .fileHandler=${this.fileHandler}
                  .singleFileUpload=${this.singleFileUpload}
                  .maxFilesPerComment=${this.maxFilesPerComment}
                  .acceptedFileTypes=${this.acceptedFileTypes}
                  .editMode=${isEdit}
                  .existingAttachments=${this.comment?.attachments || []}
                  @sc-files-change=${this.handleFileChange}
                  @sc-file-error=${this.handleFileError}
                  @sc-attachment-preview=${this.handleAttachmentPreview}
                ></sc-comment-file-upload>
              `
            : nothing}
        </div>
      </div>
    `;
  }
}
