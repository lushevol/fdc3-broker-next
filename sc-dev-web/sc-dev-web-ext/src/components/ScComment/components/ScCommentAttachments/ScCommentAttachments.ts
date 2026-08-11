import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { msg } from '../../../../i18n/localization.js';
import ScExtElement from '../../../../shared/sc-ext-element.js';
import ScCommentAttachmentsStyle from './ScCommentAttachments.style.js';
import type { CommentAttachment } from '../../types/comment-attachment.js';

/**
 * ScCommentAttachments - Display attachment list with download/delete actions
 * 
 * @fires sc-attachment-download - Emitted when download is clicked
 * @fires sc-attachment-select - Emitted when attachment is selected (alternative to download)
 * @fires sc-attachment-preview - Emitted when image attachment is previewed
 */
export class ScCommentAttachments extends ScExtElement {
  static styles = [ScCommentAttachmentsStyle];

  @property({ type: Array }) attachments: CommentAttachment[] = [];
  @property({ type: Boolean }) enableDownload = false;
  @property({ type: String }) commentId!: string;

  handleFileSelect(e: CustomEvent) {
    e.stopPropagation();
    const detail = e.detail;
    const fileId = detail['file-id'];

    const attachment = this.attachments.find(att => att.id === fileId);
    if (attachment && attachment.fileUrl) {
      this.handleDownloadAttachment(attachment);
    }
  }

  handleDownloadAttachment(attachment: CommentAttachment) {
    this.emit('sc-attachment-download', {
      detail: {
        attachment: {
          id: attachment.id,
          fileName: attachment.fileName,
          fileSize: attachment.fileSize,
          fileType: attachment.fileType,
          fileUrl: attachment.fileUrl,
        },
        commentId: this.commentId,
      },
    });

    // Trigger download
    const link = document.createElement('a');
    link.href = attachment.fileUrl;
    link.download = attachment.fileName;
    link.click();
  }

  render() {
    if (!this.attachments || this.attachments.length === 0) return nothing;

    const canDownload = this.enableDownload;
    const imageAttachments = this.attachments.filter(
      attachment =>
        attachment.fileType?.startsWith('image/') && attachment.fileUrl
    );
    const otherAttachments = this.attachments.filter(
      attachment =>
        !attachment.fileType?.startsWith('image/') || !attachment.fileUrl
    );

    return html`
      <div class="attachment-list">
        ${imageAttachments.length
          ? html`
              <div class="attachment-image-list">
                ${imageAttachments.map(attachment => html`
                  <button
                    class="attachment-image-button"
                    type="button"
                    aria-label=${attachment.fileName}
                    @click=${() =>
                      this.emit('sc-attachment-preview', {
                        detail: {
                          attachment,
                          commentId: this.commentId,
                        },
                      })}
                  >
                    <img
                      class="attachment-image"
                      src=${attachment.fileUrl}
                      alt=${attachment.fileName}
                    />
                  </button>
                `)}
              </div>
            `
          : nothing}
        ${otherAttachments.length
          ? html`
              <sc-file-list
                direction="horizontal"
                @sc-select=${this.handleFileSelect}
              >
                ${otherAttachments.map((attachment, index) => {
            // Validate attachment metadata
            const isValid =
              attachment &&
              attachment.fileName &&
              typeof attachment.fileSize === 'number' &&
              attachment.fileType &&
              attachment.fileUrl;

            // Graceful degradation for invalid attachments
            if (!isValid) {
              console.warn('Invalid attachment metadata:', attachment);
              return html`
                <sc-file-item
                  name=${attachment?.fileName || msg('Unknown file', { id: 'sc-comment-unknown-file' })}
                  file-id="invalid-${index}"
                  status="error"
                  no-border
                ></sc-file-item>
              `;
            }

            return html`
              <sc-file-item
                name=${attachment.fileName}
                file-id=${attachment.id}
                size=${attachment.fileSize}
                ?selectable=${canDownload}
                no-border
              ></sc-file-item>
            `;
          })}
              </sc-file-list>
            `
          : nothing}
      </div>
    `;
  }
}
