import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { msg } from '../../../../i18n/localization.js';
import ScExtElement from '../../../../shared/sc-ext-element.js';
import ScCommentFileUploadStyle from './ScCommentFileUpload.style.js';
import { sanitizeFileName } from '../../utils/file-utils.js';
import type { CommentAttachment } from '../../types/comment-attachment.js';
import type { ScCommentFileHandler } from '../../ScCommentFileHandler.js';

/**
 * ScCommentFileUpload - File upload component with drag-drop support
 * 
 * @fires sc-files-change - Emitted when file selection changes
 * @fires sc-file-error - Emitted when validation fails
 */
export class ScCommentFileUpload extends ScExtElement {
  static styles = [ScCommentFileUploadStyle];

  @property({ type: String }) commentId!: string;
  @property({ type: Object }) fileHandler!: ScCommentFileHandler;
  @property({ type: Boolean }) singleFileUpload = false;
  @property({ type: Number }) maxFilesPerComment = Infinity;
  @property({ type: String }) acceptedFileTypes?: string;
  @property({ type: Boolean }) editMode = false;
  @property({ type: Array }) existingAttachments: CommentAttachment[] = [];

  @state() private fileInputKey = 0;
  private previewUrls = new Map<File, string>();

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.previewUrls.forEach(url => URL.revokeObjectURL(url));
    this.previewUrls.clear();
  }

  willUpdate(changedProperties: Map<string, any>) {
    super.willUpdate(changedProperties);
    
    // Update fileInputKey when commentId or fileHandler changes
    if (
      (changedProperties.has('commentId') || changedProperties.has('fileHandler')) &&
      this.fileHandler &&
      this.commentId
    ) {
      this.fileInputKey = this.fileHandler.getFileInputKey(this.commentId);
    }
  }

  handleFileSelection(event: CustomEvent) {
    event.stopPropagation();
    const files = event.detail?.value as FileList | undefined;

    // Prevent re-processing files that are already saved
    // This happens when sc-file-input's value is updated programmatically
    const currentDraftCount = this.fileHandler.getDraftAttachments(this.commentId).length;
    if (!this.editMode && files && files.length === currentDraftCount) {
      const filesArray = Array.from(files);
      const allFilesHaveId = filesArray.every((f: any) => 'id' in f);
      
      if (allFilesHaveId) {
        return;
      }
    }

    // Detect deleted attachments in edit mode
    if (this.editMode && this.existingAttachments.length > 0) {
      const newFileNames = files ? Array.from(files).map(f => f.name) : [];
      this.existingAttachments.forEach(attachment => {
        if (!this.fileHandler.getDeletedAttachmentIds().has(attachment.id)) {
          if (!newFileNames.includes(attachment.fileName)) {
            this.fileHandler.markAttachmentDeleted(attachment.id);
          }
        }
      });
    }

    const result = this.fileHandler.handleFileSelection(
      files,
      this.commentId,
      this.editMode ? { id: this.commentId, attachments: this.existingAttachments } as any : undefined
    );

    if (!result.success && result.errorType && result.errorMessage) {
      this.emit('sc-file-error', {
        detail: {
          errorType: result.errorType,
          errorMessage: result.errorMessage,
          commentId: this.commentId,
          fileCount: result.fileCount,
          fileNames: result.fileNames,
          timestamp: new Date(),
        },
      });

      // Reset to valid state
      const fileInputElement = this.shadowRoot?.querySelector(`#file-input-${this.commentId}`) as any;
      if (fileInputElement) {
        const valueForInput = this.fileHandler.prepareFileInputValue(
          this.commentId,
          this.editMode ? { id: this.commentId, attachments: this.existingAttachments } as any : undefined
        );
        fileInputElement.value = valueForInput || [];
      }
    } else {
      // Success: files validated and saved
      // DO NOT emit sc-files-change here because we already called fileHandler.handleFileSelection
      // Emitting would cause parent (ScComment) to call handleFileSelection again and clear the files
      // this.emit('sc-files-change', {
      //   detail: {
      //     files: files ? Array.from(files) : [],
      //     commentId: this.commentId,
      //   },
      // });
    }

    this.requestUpdate();
  }

  handleDraftFileRemove(e: CustomEvent) {
    e.stopPropagation();
    const detail = e.detail;
    const fileId = detail['file-id'];

    if (fileId.startsWith('existing-')) {
      const attachmentId = fileId.replace('existing-', '');
      this.fileHandler.markAttachmentDeleted(attachmentId);
      this.fileHandler.clearAttachmentError(this.commentId);
      this.requestUpdate();
    } else if (fileId.startsWith('draft-')) {
      const parts = fileId.split('-');
      const index = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(index)) {
        this.fileHandler.removeDraftAttachment(this.commentId, index);
        this.fileHandler.clearAttachmentError(this.commentId);

        // Update file input
        const fileInputElement = this.shadowRoot?.querySelector(`#file-input-${this.commentId}`) as any;
        if (fileInputElement) {
          const valueForInput = this.fileHandler.prepareFileInputValue(
            this.commentId,
            this.editMode ? { id: this.commentId, attachments: this.existingAttachments } as any : undefined
          );
          fileInputElement.value = valueForInput || [];
        }
        this.requestUpdate();
      }
    }
  }

  triggerFileInput() {
    const fileInputWrapper = this.shadowRoot?.querySelector(`#file-input-${this.commentId}`) as any;
    
    if (fileInputWrapper) {
      // Try to trigger the file input directly
      const nativeInput = fileInputWrapper.shadowRoot?.querySelector('input[type="file"]');
      
      if (nativeInput) {
        (nativeInput as HTMLInputElement).click();
      } else {
        // Fallback: try clicking the add button
        const addButton = fileInputWrapper.querySelector('[slot="add-button"] sc-button') as any;
        addButton?.click();
      }
    }
  }

  handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    target.classList.add('drag-over');
  }

  handleDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
  }

  handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('drag-over');

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileSelection(
        new CustomEvent('sc-change', {
          detail: { value: files },
        })
      );
    }
  }

  renderDraftAttachmentList() {
    const draftFiles = this.fileHandler.getDraftAttachments(this.commentId);
    const visibleExistingAttachments = this.editMode
      ? this.existingAttachments.filter(att => !this.fileHandler.getDeletedAttachmentIds().has(att.id))
      : [];

    const totalItems = (draftFiles?.length || 0) + visibleExistingAttachments.length;

    if (totalItems === 0) return nothing;

    const imageDraftFiles = draftFiles.filter(file => file.type?.startsWith('image/'));
    const imageExistingAttachments = visibleExistingAttachments.filter(
      attachment => attachment.fileType?.startsWith('image/') && attachment.fileUrl
    );

    const currentDrafts = new Set(draftFiles);
    for (const file of this.previewUrls.keys()) {
      if (!currentDrafts.has(file)) {
        const url = this.previewUrls.get(file);
        if (url) URL.revokeObjectURL(url);
        this.previewUrls.delete(file);
      }
    }

    return html`
      <div class="draft-attachment-list">
        ${imageDraftFiles.length || imageExistingAttachments.length
          ? html`
              <div class="draft-image-list">
                ${imageExistingAttachments.map(attachment => html`
                  <button
                    class="draft-image-button"
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
                      class="draft-image"
                      src=${attachment.fileUrl}
                      alt=${attachment.fileName}
                    />
                  </button>
                `)}
                ${imageDraftFiles.map((file, index) => {
                  const existingUrl = this.previewUrls.get(file);
                  const previewUrl = existingUrl || URL.createObjectURL(file);
                  if (!existingUrl) {
                    this.previewUrls.set(file, previewUrl);
                  }
                  const draftAttachment: CommentAttachment = {
                    id: `draft-${this.commentId}-${index}`,
                    commentId: this.commentId,
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: file.type,
                    fileUrl: previewUrl,
                    uploadedBy: '',
                    uploadedAt: new Date(),
                  };

                  return html`
                    <button
                      class="draft-image-button"
                      type="button"
                      aria-label=${file.name}
                      @click=${() =>
                        this.emit('sc-attachment-preview', {
                          detail: {
                            attachment: draftAttachment,
                            commentId: this.commentId,
                          },
                        })}
                    >
                      <img
                        class="draft-image"
                        src=${previewUrl}
                        alt=${file.name}
                      />
                    </button>
                  `;
                })}
              </div>
            `
          : nothing}
        <sc-file-list 
          direction="horizontal"
          @sc-remove=${this.handleDraftFileRemove}
        >
          ${visibleExistingAttachments.map(attachment => html`
            <sc-file-item
              name=${sanitizeFileName(attachment.fileName)}
              file-id="existing-${attachment.id}"
              size=${attachment.fileSize}
              deletable
              no-border
            ></sc-file-item>
          `)}
          ${draftFiles?.map((file, index) => html`
            <sc-file-item
              name=${sanitizeFileName(file.name)}
              file-id="draft-${this.commentId}-${index}"
              size=${file.size}
              deletable
              no-border
            ></sc-file-item>
          `)}
        </sc-file-list>
      </div>
    `;
  }

  render() {
    // Validate required props
    if (!this.fileHandler) {
      console.warn('[ScCommentFileUpload] fileHandler prop is required');
      return nothing;
    }

    if (!this.commentId) {
      console.warn('[ScCommentFileUpload] commentId prop is required');
      return nothing;
    }

    const key = this.fileHandler.getFileInputKey(this.commentId);

    if (key < 0) {
      console.warn(`[ScCommentFileUpload] Invalid file input key (${key}) for commentId: ${this.commentId}`);
      return nothing;
    }

    const valueForInput = this.fileHandler.prepareFileInputValue(
      this.commentId,
      this.editMode ? { id: this.commentId, attachments: this.existingAttachments } as any : undefined
    );

    const isLimitReached = this.fileHandler.isLimitReached(
      this.commentId,
      this.editMode ? { id: this.commentId, attachments: this.existingAttachments } as any : undefined
    ) ?? false;

    return html`
      <div class="file-upload-container">
        <!-- Hidden sc-file-input -->
        <sc-file-input
          id="file-input-${this.commentId}"
          key="file-input-${this.commentId}-${key}"
          ?multiple=${!this.singleFileUpload}
          .accept=${this.acceptedFileTypes || nothing}
          deletable
          .value=${valueForInput || nothing}
          @sc-change=${this.handleFileSelection}
          style="display: none;"
        >
          <div slot="add-button">
            <sc-button icon="upload" size="sm" fill="">Add Files</sc-button>
          </div>
        </sc-file-input>

        <!-- Custom upload zone -->
        <div 
          class="custom-upload-zone"
          @click=${this.triggerFileInput}
          @dragover=${this.handleDragOver}
          @dragleave=${this.handleDragLeave}
          @drop=${this.handleDrop}
          ?disabled=${isLimitReached}
        >
          <sc-icon name="upload" size="sm"></sc-icon>
          <div style="display: flex; flex-direction: column; gap: 0.125rem;">
            <span class="upload-text">
              ${isLimitReached
                ? msg('Maximum files reached', { id: 'sc-comment-max-files-reached' })
                : msg('Click or drag files here to upload', { id: 'sc-comment-upload-zone' })}
            </span>
            ${!isLimitReached && this.acceptedFileTypes ? html`
              <span class="upload-format-hint">
                ${msg('Accepted file formats', { id: 'sc-comment-accepted-formats' })}: ${this.acceptedFileTypes}
              </span>
            ` : nothing}
          </div>
        </div>

        <!-- Draft files list -->
        ${this.renderDraftAttachmentList()}
      </div>
    `;
  }
}
