import { html, nothing, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import ScCommentStyle from './ScComment.style.js';
import dayjs from 'dayjs/esm/index.js';
import relativeTime from 'dayjs/esm/plugin/relativeTime/index.js';
import ScExtElement from '../../shared/sc-ext-element.js';
import type { CommentAttachment } from './types/comment-attachment.js';
import {
  type UserInfo,
  type Comment,
  type CommentBaseDemand,
  CommentModel,
  type Action,
  type CommentAction,
  type ReminderConfig,
  type ReminderTriggerDetail,
  type AttachmentPreviewDetail,
  type ToolbarOption,
  ScCommentFields,
  type ReminderTimeEntry,
} from './ScComment.types.js';
import { msg } from '../../i18n/localization.js';
import { ScCommentUtils } from './ScComment.utils.js';
import { ScCommentFileHandler } from './ScCommentFileHandler.js';
import { DEFAULT_POSTER_OPTIONS, DEFAULT_SORTER_OPTIONS } from './ScComment.constants.js';
import { createComment, getComments, deleteComment, updateComment, likeComment, unlikeComment } from '../../apis/comment.js';
import { transformCommentsData, updateCommentById } from './utils/tools.js';
import { watch } from '../../shared/watch.js';

dayjs.extend(relativeTime);

export class ScComment extends ScExtElement implements ScCommentFields {
  // @ts-ignore: Ignore static styles for hover tips
  static styles = [ScCommentStyle];

  @property({ type: Object }) userInfo!: UserInfo;
  @property({ type: Array }) actions: Action[] = [];
  @property({ type: Array }) toolbar: Array<any> = [];
  @property({ type: Boolean }) compact = false;

  @property({ type: Array }) comments: Comment[] = [];
  @property({ type: Array }) singleRequestComments: CommentBaseDemand[] = [];
  @property({ type: Number }) requestPageSize = 20;
  @property({ type: Number }) requestPageNumber = 0;
  @property({ type: Object }) posterFilters: Record<
    string,
    (comment: Comment, userBankid: string) => boolean
  > = {};
  @property({ type: Object }) sorterComparators: Record<
    string,
    (a: Comment, b: Comment) => number
  > = {};

  @state() value: string;
  @state() hoveringCommentId?: string;
  @state() replyContent: string;
  @state() errorMessage = '';
  @state() successMessage = '';
  @state() disabledHours:number[] = [];
  @state() disabledMinutes:number[] = [];
  @state() disabledSeconds:number[] = [];

  @property({ type: Array }) viewOptions: ToolbarOption[] = [];
  @property({ type: Array }) sortOptions: ToolbarOption[] = [];
  /**
   * When false (default): comments are filtered/sorted internally (client mode).
   * When true: the component skips internal filtering/sorting and emits sc-view-sort-change
   * so the host can fetch new data and pass it back via the comments property (server/manual mode).
   */
  @property({ type: Boolean, attribute: 'manual-sorting' }) manualSorting = false;

  @state() poster = 'all';
  @state() sorter = 'newest';

  @watch('userInfo')
  userInfoChanged() {
    if (this.enableApi) {
      this.setUserInfo();
    }
  }

  /**
   * Built-in defaults merged with any host-supplied extra options (deduplicated by value).
   */
  get effectivePosterOptions(): Array<{ label: string; value: string }> {
    const defaults = DEFAULT_POSTER_OPTIONS();
    const extra = (this.viewOptions ?? []).filter(
      o => !defaults.some(d => d.value === o.value)
    );
    return [...defaults, ...extra];
  }

  get effectiveSorterOptions(): Array<{ label: string; value: string }> {
    const defaults = DEFAULT_SORTER_OPTIONS();
    const extra = (this.sortOptions ?? []).filter(
      o => !defaults.some(d => d.value === o.value)
    );
    return [...defaults, ...extra];
  }

  handleValueChange(event: CustomEvent<{ text: string }>): void {
    this.value = event.detail.text;
  }
  handleReplyContentChange(event: CustomEvent<{ text: string }>): void {
    this.replyContent = event.detail.text;
  }
  async handlePost(event?: CustomEvent) {
    const text = event ? event.detail.text : this.value;
    const files = event
      ? event.detail.files
      : this.fileHandler.getDraftAttachments('root');
    this.value = text;
    const rootId = 'root';

    // Convert files to CommentAttachment objects
    const attachments: CommentAttachment[] = files.map(
      (file: File, index: number) =>
        ScCommentUtils.fileToAttachment(file, index, this.userInfo.bankid, '')
    );

    const newComment: Comment = new CommentModel({
      id: crypto.randomUUID(),
      text: this.value,
      createdAt: new Date(),
      user: this.userInfo,
      attachments: attachments.length > 0 ? attachments : undefined,
      mentions: event?.detail?.mentions || [],
    });

    attachments.forEach(att => (att.commentId = newComment.id));

    if (files.length > 0) {
      this.emit('sc-comment-file-upload', {
        detail: {
          files,
          attachments,
          comment: {
            id: newComment.id,
            text: newComment.text,
            parentID: undefined,
            user: this.userInfo,
          },
          isEdit: false,
          uploadCount: files.length,
          totalAttachments: files.length,
        },
      });
    }
    if (this.enableApi) {
      const res: Comment = await this.requestCreateCommentApi(newComment) as Comment;
      newComment.id = res.id;
    }

    this.emitChange([...this.comments, newComment]);
    this.value = '';
    this.fileHandler.clearDrafts(rootId);
    this.fileHandler.resetFileInput(rootId, () => this.requestUpdate());
  }

  @property({ type: Number, attribute: 'max-replies-depth' }) maxRepliesdepth = 5;
  @property({ type: Number, attribute: 'max-visible-replies' }) maxVisibleReplies = 5;

  @property({ type: Boolean, attribute: 'hide-view-condition' }) hideViewCondition = false;
  @property({ type: Boolean, attribute: 'hide-sort-by' }) hideSortBy = false;
  @property({ type: Boolean }) readonly = false;

  @property({ type: Boolean, attribute: 'enable-like' }) enableLike = false;
  @property({ type: Boolean, attribute: 'enable-share' }) enableShare = false;
  @property({ type: Boolean, attribute: 'enable-report' }) enableReport = false;
  @property({ type: Boolean, attribute: 'enable-edit' }) enableEdit = false;
  @property({ type: Boolean, attribute: 'enable-delete' }) enableDelete = false;
  @property({ type: Boolean, attribute: 'compact-reply-mode' })
  compactReplyMode = false;
  @property({ type: Boolean, attribute: 'enable-reminder' }) enableReminder = false;
  @property({ type: Boolean, attribute: 'enable-mark' }) enableMark = false;
  @property({ type: Boolean, attribute: 'hide-avatar' }) hideAvatar = false;

  // File attachment properties
  @property({ type: Boolean, attribute: 'enable-upload' })
  enableUpload = false;
  @property({ type: Boolean, attribute: 'single-file-upload' })
  singleFileUpload = false;
  @property({ type: Number, attribute: 'max-files-per-comment' })
  maxFilesPerComment = Infinity;
  @property({ type: String, attribute: 'accepted-file-types' })
  acceptedFileTypes?: string;
  @property({ type: Boolean, attribute: 'enable-file-delete' })
  enableFileDelete = false;
  @property({ type: Boolean, attribute: 'disable-file-download' })
  disableFileDownload = false;
  @property({ type: Boolean, attribute: 'enable-api' }) enableApi = false;
  @property({ type: String, attribute: 'reference-id' }) referenceId = 'sc-comment-default-reference-id';
  @property({ type: Boolean }) loadMoreLoading = false;
  @property({ type: Boolean }) requestLoading = false;
  // More actions for dropdown menu
  @property({ type: Array }) moreActions: CommentAction[] = [];
  
  @property({ type: Object }) reminderConfig?: ReminderConfig;

  @state()
  public activeComment: Comment | null = null;
  @state()
  public activeEditComment: Comment | null = null;
  @state()
  private repliesExpanded: Record<string, boolean> = {};

  /**
   * Persists draft text per commentId so that collapsing by clicking outside
   * does not discard the user's in-progress reply/edit text.
   */
  private draftTexts = new Map<string, string>();

  /**
   * Persists deleted-attachment IDs per commentId across collapses.
   */
  private draftDeletedIds = new Map<string, Set<string>>();

  // File handler instance
  private fileHandler!: ScCommentFileHandler;

  @state() openModal = false;
  @state() modalRelatedComment: Comment | null = null;
  modalRelatedAction: (e: CustomEvent) => void = () => {};

  @state() previewOpen = false;
  @state() previewAttachment: CommentAttachment | null = null;

  @state() reminderOpen = false;
  @state() markOpen = false;
  @state() reminderRelatedComment: Comment | null = null;
  @state() reminderDate = '';
  @state() reminderTime = '';
  @state() reminderTimeList:any = [];
  @state() reminderStatus: 'need-clarification' | 'in-progress' | 'resolved' | 'critical' = 'in-progress';
  @state() reminderActionType: 'create' | 'update' | 'delete' | '' = 'create';
  
  private reminderTimers = new Map<string, number>();
  
  async firstUpdated(_changedProperties: PropertyValues): Promise<void> {
    super.firstUpdated(_changedProperties);
    if (this.enableApi) {
      this.resetParametersAndData();
      const res:any = await this.requestGetCommentList();
      if ((res?.items ?? []).length >= 0) {
        this.requestPageNumber = 1;
      }
      this.setUserInfo();
    }
  }
  resetParametersAndData() {
    this.requestPageNumber = 0;
    this.requestPageSize = 20;
    this.manualSorting = false;
    this.comments = [];
    this.singleRequestComments = [];
    this.repliesExpanded = {};
  }
  // Initialize file handler
  connectedCallback() {
    super.connectedCallback();
    this.fileHandler = new ScCommentFileHandler(
      this.maxFilesPerComment,
      this.acceptedFileTypes
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  setUserInfo() {
    const userInfo = this._user;
    this.userInfo = {
      bankid: userInfo?.id ?? '',
      name: `${userInfo?.firstName ?? '' } ${ userInfo?.lastName ?? ''}`,
    };
    this.requestUpdate();
  }

  async requestCreateCommentApi(comment: Comment) {
    const res = await createComment(this._graphQLClient?.query, {
      mentions: (comment.mentions ?? []).map(item=>item.id),
      parentId: comment?.parentID ?? '',
      referenceId: this.referenceId ?? '',
      reminderTimeList: [],
      source: '',
      text: comment.text,
    });
    if (res) {
      this.successMessage = msg('Comment posted', {
        id: 'sc-comment-create-success',
      });
    }
    return new Promise(resolve => resolve(res));
  }
  
  async requestGetCommentList() {
    if (!this.loadMoreLoading) {
      this.requestLoading = true;
    }
    try {
      const res: any = await getComments(this._graphQLClient?.query, {
        referenceId: this.referenceId ?? '',
        source: '',
        sort: this.sorter === 'newest' ? 'createdDate,desc' : 'createdDate,asc',
        view: this.poster, // all, mine
        page: this.requestPageNumber,
        size: this.requestPageSize,
      });
      if (res) {
        const comments = transformCommentsData(res?.items ?? [], this.comments);
        this.comments = [...this.comments, ...comments];
        this.singleRequestComments = res?.items ?? [];
      }
      this.requestLoading = false;
      return new Promise(resolve => resolve(res));
    }
    finally {
      this.requestLoading = false;
    }
    
  }

  async requestDeleteCommentApi(commentId: string) {
    const res: any = await deleteComment(this._graphQLClient?.query, commentId, '');
    if (res?.success) {
      // Remove deleted comment and its children from local list
      const childIds = ScCommentUtils.getAllChildCommentIds(commentId, this.comments);
      const deleteIds = new Set([commentId, ...childIds]);
      this.comments = this.comments.filter(c => !deleteIds.has(c.id));
      this.successMessage = msg('Comment removed', { id: 'sc-comment-delete-success' });
    }
  }

  async requestUpdateCommentApi(comment: Comment) {
    const res: any = await updateComment(this._graphQLClient?.query, {
      id: comment.id,
      mentions: (comment.mentions ?? []).map(item=>item.id),
      source: '',
      text: comment.text,
      reminderTimeList: comment.reminderTimeList?.map((r: ReminderTimeEntry) => new Date(r.time).toISOString()) ?? [],
      status: comment.status ?? '',
    });
    if (res) {
      this.successMessage = msg('Comment updated', { id: 'sc-comment-update-success' });
    }
  }

  async requestLikeCommentApi(commentId: string) {
    await likeComment(this._graphQLClient?.query, commentId, '');
  }

  async requestUnlikeCommentApi(commentId: string) {
    await unlikeComment(this._graphQLClient?.query, commentId, '');
  }

  /**
   * Collapses the active reply/edit input while preserving the draft text and
   * file attachments so they can be restored when the user re-opens it.
   */
  private _collapseWithDraftPreserved() {
    const commentId = this.activeEditComment?.id || this.activeComment?.id;
    if (commentId) {
      // Persist the current text as a draft
      if (this.replyContent) {
        this.draftTexts.set(commentId, this.replyContent);
      }
      // Persist current deleted-attachment state
      const deletedIds = this.fileHandler.getDeletedAttachmentIds();
      if (deletedIds.size > 0) {
        this.draftDeletedIds.set(commentId, new Set(deletedIds));
      }
      // NOTE: we deliberately do NOT call fileHandler.clearDrafts() here,
      // so that the uploaded files survive the collapse.
    }
    // Collapse without clearing state
    this.activeEditComment = null;
    this.activeComment = null;
  }

  // Toggle replies visibility for a comment by id
  toggleReplies(commentId: string) {
    const nextExpanded = !this.repliesExpanded[commentId];
    this.repliesExpanded = {
      ...this.repliesExpanded,
      [commentId]: nextExpanded,
    };

    this.emit('sc-toggle-replies', {
      detail: {
        commentId,
        expanded: nextExpanded,
      },
    });
  }

  // Returns whether replies for a comment should be expanded
  isRepliesExpanded(commentId: string): boolean {
    return !!this.repliesExpanded[commentId];
  }

  private emitChange(allComments: Comment[]) {
    this.emit('sc-change', {
      detail: {
        allComments,
      },
    });
  }

  /**
   * Handle file selection from sc-file-input
   * @param event CustomEvent<{value: FileList}> from sc-file-input
   */
  handleFileSelection(event: CustomEvent, commentId: string) {
    const files = event.detail?.value as FileList | undefined;

    // In edit mode, detect deleted attachments by comparing old and new file lists
    if (this.activeEditComment && this.activeEditComment.id === commentId) {
      const existingAttachments = this.activeEditComment.attachments || [];
      const newFileNames = files ? Array.from(files).map(f => f.name) : [];

      // Find attachments that were removed
      existingAttachments.forEach(attachment => {
        if (!this.fileHandler.getDeletedAttachmentIds().has(attachment.id)) {
          // Check if this attachment's file is still in the new file list
          if (!newFileNames.includes(attachment.fileName)) {
            // Attachment was deleted via sc-file-input
            this.fileHandler.markAttachmentDeleted(attachment.id);
          }
        }
      });
    }

    const result = this.fileHandler.handleFileSelection(
      files,
      commentId,
      this.activeEditComment
    );

    if (!result.success && result.errorType && result.errorMessage) {
      // Emit error event
      this.emitFileErrorEvent(
        result.errorType,
        result.errorMessage,
        commentId,
        result.fileCount,
        result.fileNames
      );

      // Reset sc-file-input to the valid state when validation fails
      const fileInputElement = this.shadowRoot?.querySelector(
        `#file-input-${commentId}`
      ) as any;

      if (fileInputElement) {
        // Restore to the previous valid state
        const valueForInput = this.fileHandler.prepareFileInputValue(
          commentId,
          this.activeEditComment
        );
        fileInputElement.value = valueForInput || [];
      }
    }

    // Force re-render to update sc-file-input .value
    this.requestUpdate();
  }

  /**
   * Remove attachment from draft (before posting)
   */
  removeDraftAttachment(commentId: string, fileIndex: number) {
    this.fileHandler.removeDraftAttachment(commentId, fileIndex);

    // Update sc-file-input value to reflect the change
    const fileInputElement = this.shadowRoot?.querySelector(
      `#file-input-${commentId}`
    ) as any;

    if (fileInputElement) {
      // Prepare updated value for sc-file-input
      const valueForInput = this.fileHandler.prepareFileInputValue(
        commentId,
        this.activeEditComment
      );

      // Update the file input value
      fileInputElement.value = valueForInput || [];
    }

    this.requestUpdate();
  }

  /**
   * T040: Emit file error event for validation failures
   */
  emitFileErrorEvent(
    errorType: string,
    errorMessage: string,
    commentId: string,
    fileCount?: number,
    fileNames?: string[]
  ) {
    this.emit('sc-comment-file-error', {
      detail: {
        errorType,
        errorMessage,
        commentId,
        fileCount,
        fileNames,
        timestamp: new Date(),
      },
    });
  }

  handleCancel() {
    const commentId = this.activeEditComment?.id || this.activeComment?.id;
    if (commentId) {
      // Clear all draft state (explicit cancel discards everything)
      this.draftTexts.delete(commentId);
      this.draftDeletedIds.delete(commentId);
      this.fileHandler.clearDrafts(commentId);

      // Two-phase reset: destroy then recreate sc-file-input
      this.fileHandler.resetFileInput(commentId, () => this.requestUpdate());
    }
    // Clear deleted attachment IDs
    this.fileHandler.clearDeletedIds();

    this.activeEditComment = null;
    this.activeComment = null;
  }

  handleClose() {
    this._collapseWithDraftPreserved();
  }

  async handleReply(event?: CustomEvent) {
    const activeComment = this.activeEditComment || this.activeComment;
    const text = event ? event.detail.text : this.replyContent;
    const files = event
      ? event.detail.files
      : activeComment
      ? this.fileHandler.getDraftAttachments(activeComment.id)
      : [];
    const mode = event
      ? event.detail.mode
      : this.activeEditComment
      ? 'edit'
      : 'reply';
    this.replyContent = text; // Update state

    if (mode === 'edit' && this.activeEditComment) {
      const replyId = this.activeEditComment.id;
      const originalAttachments = this.activeEditComment.attachments || [];

      // Convert new draft files to CommentAttachment objects
      const newAttachments: CommentAttachment[] = files
        .filter((file: any) => file instanceof File)
        .map((file: File, index: number) =>
          ScCommentUtils.fileToAttachment(
            file,
            index,
            this.userInfo.bankid,
            replyId
          )
        );

      // Get existing attachments and filter out deleted ones
      const existingAttachments = originalAttachments.filter(
        att => !this.fileHandler.getDeletedAttachmentIds().has(att.id)
      );

      const updatedComment: Comment = {
        ...this.activeEditComment,
        attachments: [...existingAttachments, ...newAttachments],
        text: this.replyContent,
        updatedAt: new Date(),
        mentions: event?.detail?.mentions ?? [],
      };
      this.replyContent = '';

      if (files.length > 0) {
        this.emit('sc-comment-file-upload', {
          detail: {
            files,
            attachments: newAttachments,
            comment: {
              id: updatedComment.id,
              text: updatedComment.text,
              parentID: updatedComment.parentID,
              user: this.userInfo,
            },
            isEdit: true,
            uploadCount: files.length,
            totalAttachments: updatedComment.attachments?.length ?? 0,
          },
        });
      }

      if (this.fileHandler.getDeletedAttachmentIds().size > 0) {
        const deletedAttachments = Array.from(
          this.fileHandler.getDeletedAttachmentIds()
        )
          .map((deletedId: string) =>
            originalAttachments.find(att => att.id === deletedId)
          )
          .filter((att): att is CommentAttachment => Boolean(att));

        if (deletedAttachments.length > 0 && this.activeEditComment) {
          this.emit('sc-comment-file-delete', {
            detail: {
              deletedAttachments,
              comment: {
                id: updatedComment.id,
                text: updatedComment.text,
                parentID: updatedComment.parentID,
                user: updatedComment.user,
              },
              deleteCount: deletedAttachments.length,
              remainingAttachments: updatedComment.attachments?.length ?? 0,
            },
          });
        }
      }

        this.emitChange(
          this.comments.map(comment =>
            comment.id === updatedComment.id ? updatedComment : comment
          )
        );
      const findComment = this.comments.find(c => c.id === updatedComment.id);
      if (findComment && this.enableApi) {
        this.requestUpdateCommentApi(updatedComment);
      }
      this.draftTexts.delete(replyId);
      this.draftDeletedIds.delete(replyId);
      this.fileHandler.clearDrafts(replyId);
      this.fileHandler.clearDeletedIds();
      this.fileHandler.resetFileInput(replyId, () => this.requestUpdate());
      this.activeEditComment = null;
      this.activeComment = null;
    } else if (mode === 'reply' && this.activeComment) {
      const replyId = this.activeComment.id;

      // Convert files to CommentAttachment objects
      const attachments: CommentAttachment[] = files.map(
        (file: File, index: number) =>
          ScCommentUtils.fileToAttachment(
            file,
            index,
            this.userInfo.bankid,
            ''
          )
      );

      const newComment: Comment = new CommentModel({
        id: crypto.randomUUID(),
        parentID: this.activeComment.id,
        text: this.replyContent,
        createdAt: new Date(),
        user: this.userInfo,
        attachments: attachments.length > 0 ? attachments : undefined,
        mentions: event?.detail?.mentions || [],
      });
      
      if (this.enableApi) {
        const res: Comment = await this.requestCreateCommentApi(newComment) as Comment;
        newComment.id = res.id;
      }

      attachments.forEach(att => (att.commentId = newComment.id));

      if (files.length > 0) {
        this.emit('sc-comment-file-upload', {
          detail: {
            files,
            attachments,
            comment: {
              id: newComment.id,
              text: newComment.text,
              parentID: newComment.parentID,
              user: this.userInfo,
            },
            isEdit: false,
            uploadCount: files.length,
            totalAttachments: files.length,
          },
        });
      }
      this.comments = [...this.comments, newComment];
      this.emitChange(this.comments);
      this.replyContent = '';
      this.draftTexts.delete(replyId);
      this.draftDeletedIds.delete(replyId);
      this.fileHandler.clearDrafts(replyId);
      this.fileHandler.resetFileInput(replyId, () => this.requestUpdate());

      if (!this.isRepliesExpanded(this.activeComment.id)) {
        this.toggleReplies(this.activeComment.id);
      }
      this.activeComment = null;
    }
  }

  getRelativeTime(createdAt: Date, updatedAt?: Date) {
    return dayjs(updatedAt ? updatedAt : createdAt).fromNow();
  }

  getAllChildCommentIds = ScCommentUtils.getAllChildCommentIds;
  handleToggleReplies(commentId: string) {
    const allChildIds = this.getAllChildCommentIds(commentId, this.comments);
    const isComentActiveUnderExpandedReplies =
      this.activeComment && allChildIds.includes(this.activeComment.id);
    const isCommentInactive = this.activeComment === null;
    if (isComentActiveUnderExpandedReplies || isCommentInactive) {
      this.replyContent = '';
      this.activeComment = null;
    }

    setTimeout(() => {
      this.toggleReplies(commentId);
    }, 50);
  }

  // Event handlers from sub-components (receive CustomEvent)
  handleReplyClick(event: CustomEvent | CommentBaseDemand) {
    const comment = event instanceof CustomEvent ? event.detail.comment : event;
    if (this.activeComment?.id !== comment.id) {
      if (this.activeEditComment) {
        this.activeEditComment = null;
      }
      // Restore draft text if there is one, otherwise start fresh
      this.replyContent = this.draftTexts.get(comment.id) ?? '';
      this.activeComment = comment;

      // If no draft files exist yet, do a clean reset; otherwise keep existing drafts
      const hasDraftFiles = this.fileHandler.getDraftAttachments(comment.id).length > 0;
      if (!hasDraftFiles) {
        this.fileHandler.resetFileInput(comment.id, () => this.requestUpdate());
      } else {
        // Files already in fileHandler — just trigger a re-render
        this.requestUpdate();
      }
    } else {
      this.activeComment = null;
      this.activeEditComment = null;
      this.replyContent = '';
    }
  }
  handleLikeClick(event: CustomEvent | CommentBaseDemand) {
    const comment = event instanceof CustomEvent ? event.detail.comment : event;
    this.emit('sc-comment-like', {
      detail: {
        comment,
      },
    });
    if (comment?.likedByCurrentUser) {
      comment.likes = (comment.likes ?? 1) - 1;
      comment.likedByCurrentUser = false;
      this.enableApi && this.requestUnlikeCommentApi(comment.id);
    }
    else {
      comment.likes = (comment.likes ?? 0) + 1;
      comment.likedByCurrentUser = true;
      this.enableApi && this.requestLikeCommentApi(comment.id);
    }
    this.comments = this.comments.map(c => c.id === comment.id ? comment : c);
    this.emitChange(this.comments);
    
  }
  handleShareClick(event: CustomEvent | CommentBaseDemand) {
    const comment = event instanceof CustomEvent ? event.detail.comment : event;
    this.emit('sc-comment-share', {
      detail: {
        comment,
      },
    });
  }
  handleReportClick(event: CustomEvent | CommentBaseDemand) {
    const comment = event instanceof CustomEvent ? event.detail.comment : event;
    this.emit('sc-comment-report', {
      detail: {
        comment,
      },
    });
  }
  handleEditClick(event: CustomEvent | CommentBaseDemand) {
    const comment = event instanceof CustomEvent ? event.detail.comment : event;
    if (this.activeComment?.id !== comment.id) {
      this.activeComment = comment;
      this.activeEditComment = comment;

      // Restore draft text if the user had started editing and then clicked away;
      // otherwise fall back to the current comment text
      this.replyContent = this.draftTexts.get(comment.id) ?? comment.text;

      // Restore persisted deleted-attachment state if available
      const savedDeletedIds = this.draftDeletedIds.get(comment.id);
      if (savedDeletedIds && savedDeletedIds.size > 0) {
        savedDeletedIds.forEach(id => this.fileHandler.markAttachmentDeleted(id));
      }

      // If no draft files exist yet, do a clean reset; otherwise keep existing drafts
      const hasDraftFiles = this.fileHandler.getDraftAttachments(comment.id).length > 0;
      if (!hasDraftFiles) {
        this.fileHandler.resetFileInput(comment.id, () => this.requestUpdate());
      } else {
        this.requestUpdate();
      }
    } else {
      const commentId = comment.id;
      // User clicked edit again on the open editor — treat as explicit cancel
      this.draftTexts.delete(commentId);
      this.draftDeletedIds.delete(commentId);
      this.fileHandler.clearDrafts(commentId);
      this.fileHandler.clearDeletedIds();

      // Two-phase reset: destroy then recreate sc-file-input
      this.fileHandler.resetFileInput(commentId, () => this.requestUpdate());

      this.activeComment = null;
      this.activeEditComment = null;
      this.replyContent = '';
    }
  }
  handleModalClose = () => {
    this.openModal = false;
    this.modalRelatedComment = null;
    this.modalRelatedAction = () => {};
  };

  handlePreviewClose = () => {
    this.previewOpen = false;
    this.previewAttachment = null;
  };

  handleReminderClose = () => {
    this.reminderOpen = false;
    this.reminderRelatedComment = null;
    this.reminderDate = '';
    this.reminderTime = '';
    this.reminderTimeList = [];
  };

  handleMarkClose = () => {
    this.markOpen = false;
  };

  private openReminderModal(comment: Comment) {
    this.reminderRelatedComment = comment;
    this.reminderOpen = true;
    this.reminderTimeList = comment.reminderTimeList ?? [];
    if (comment.reminderAt) {
      const date = new Date(comment.reminderAt);
      this.reminderDate = dayjs(date).format('YYYY-MM-DD');
      this.reminderTime = dayjs(date).format('HH:mm');
    } 
    this.reminderStatus = this.reminderConfig?.defaultStatus ?? 'in-progress';
    this.updateDisabledTimeOptions();
  }

  private openMarkModal(comment: Comment) {
    this.reminderRelatedComment = comment;
    this.markOpen = true;
  }

  private handleReminderStatusChange(e: CustomEvent) {
    e.stopPropagation();
    this.reminderStatus = e.detail.value;
  }

  private handleReminderDateChange(e: CustomEvent) {
    e.stopPropagation();
    const targetValue = (e.target as HTMLInputElement | null)?.value;
    this.reminderDate = e.detail?.value ?? targetValue ?? '';
  }

  private handleReminderTimeChange(e: CustomEvent) {
    e.stopPropagation();
    const targetValue = (e.target as HTMLInputElement | null)?.value;
    this.reminderTime = e.detail?.value ?? targetValue ?? '';
    this.updateDisabledTimeOptions();
  }

  private emitReminderTrigger(detail: ReminderTriggerDetail) {
    this.emit('sc-reminder-trigger', { detail });
  }

  private updateComment(commentId: string, updates: Partial<Comment>) {
    const updated = this.comments.map(comment =>
      comment.id === commentId ? { ...comment, ...updates } : comment
    );
    this.emitChange(updated);
    this.requestUpdate();
  }

  private scheduleReminder(detail: ReminderTriggerDetail) {
    const targetTime = Date.parse(detail.scheduledAt);
    if (Number.isNaN(targetTime)) return;

    const existing = this.reminderTimers.get(detail.commentId);
    if (existing) {
      clearTimeout(existing);
    }

    const delay = targetTime - Date.now();
    if (delay <= 0) {
      this.emitReminderTrigger(detail);
      this.handleReminderClear();
      return;
    }

    const timerId = window.setTimeout(() => {
      this.reminderTimers.delete(detail.commentId);
      this.emitReminderTrigger(detail);
      this.handleReminderClear();
    }, delay);

    this.reminderTimers.set(detail.commentId, timerId);
  }

  private clearReminderTimer(commentId: string) {
    const existing = this.reminderTimers.get(commentId);
    if (existing) {
      clearTimeout(existing);
      this.reminderTimers.delete(commentId);
    }
  }

  /**
   * Clears the reminder date on the related comment, cancels any pending timer,
   * and closes the reminder panel.
   */
  private handleReminderClear() {
    if (!this.reminderRelatedComment) return;
    this.clearReminderTimer(this.reminderRelatedComment.id);
    const deleteId = this.reminderTimeList[0]?.id;
    if (deleteId) {
      this.handleReminderTimeListDelete(deleteId);
    }
  }

  /**
   * Immediately applies the chosen reminder status to the related comment,
   * clears any pending timer, and closes the reminder panel.
   */
  private handleReminderMarkNow() {
    if (!this.reminderRelatedComment) return;
    this.clearReminderTimer(this.reminderRelatedComment.id);
    this.updateComment(this.reminderRelatedComment.id, {
      status: this.reminderStatus,
      reminderAt: undefined,
      targetStatus: undefined,
    });
    if (this.enableApi) {
      this.reminderRelatedComment.status = this.reminderStatus;
      this.reminderRelatedComment.reminderTimeList = [];
      this.requestUpdateCommentApi(this.reminderRelatedComment);
    }
    const detail: ReminderTriggerDetail = {
      commentId: this.reminderRelatedComment.id,
      scheduledAt: new Date().toISOString(),
      targetStatus: this.reminderStatus,
    };
    this.emitReminderTrigger(detail);
    this.handleMarkClose();
  }

  private handleReminderConfirm() {
    if (!this.reminderRelatedComment) return;

    // Scheduled path — requires both date and time fields
    if (!this.reminderDate || !this.reminderTime) return;
    let scheduledAt = new Date(
      `${this.reminderDate}T${this.reminderTime}`
    ).toISOString();
    if (!scheduledAt) return;

    const newEntry: ReminderTimeEntry = {
      id: crypto.randomUUID(),
      time: `${this.reminderDate} ${this.reminderTime}`,
    };

    if (dayjs(newEntry.time).isBefore(dayjs())) {
      console.error('Reminder time cannot be in the past:', newEntry.time);
      this.errorMessage = msg('The reminder time cannot be in the past. Please select a future date and time.', {
        id: 'sc-comment-reminder-past-time-error',
      });
      return;
    }

    if (this.reminderActionType === 'create' && this.reminderTimeList.some((entry: ReminderTimeEntry) => entry.time === newEntry.time)) {
      console.error('Duplicate reminder time entry, ignoring:', newEntry.time);
      this.errorMessage = msg('Duplicate reminder time entry, ignoring: ', {
        id: 'sc-comment-reminder-duplicate-time-error',
      }) + newEntry.time;
      return;
    }
    let updatedList = this.reminderTimeList ?? [];
    if (this.reminderActionType === 'create') {
      updatedList = [newEntry, ...updatedList];
    }
    this.reminderActionType = 'create';

    updatedList.sort((a: ReminderTimeEntry, b: ReminderTimeEntry) => {
      const timeA = dayjs(a.time).valueOf();
      const timeB = dayjs(b.time).valueOf();
      return timeA - timeB;
    });
    this.reminderTimeList = updatedList;
    scheduledAt = new Date(updatedList[0]?.time).toISOString();
    this.updateComment(this.reminderRelatedComment.id, {
      reminderAt: scheduledAt,
      status: undefined,
      targetStatus: this.reminderStatus,
      reminderTimeList: updatedList,
    });
    if (this.enableApi) {
      this.reminderRelatedComment.reminderTimeList = this.reminderTimeList;
      this.requestUpdateCommentApi(this.reminderRelatedComment);
    }

    const detail: ReminderTriggerDetail = {
      commentId: this.reminderRelatedComment.id,
      scheduledAt,
      targetStatus: this.reminderStatus,
    };

    this.scheduleReminder(detail);
    this.handleReminderClose();
  }

  private handleReminderTimeListDelete(entryId: string) {
    const updatedList = this.reminderTimeList.filter((r: ReminderTimeEntry) => r.id !== entryId);
    this.reminderTimeList = updatedList;
    let date = undefined;
    if (updatedList.length > 0) {
      date = new Date(updatedList[0]?.time);
      this.reminderDate = dayjs(date).format('YYYY-MM-DD');
      this.reminderTime = dayjs(date).format('HH:mm');
    }
    else {      
      this.reminderDate = '';
      this.reminderTime = '';
    }
    if (this.reminderRelatedComment) {
      this.updateComment(this.reminderRelatedComment.id, {
        reminderAt: date,
        reminderTimeList: updatedList,
      });
      if (this.enableApi && this.reminderTimeList.length === 0) {
        this.reminderRelatedComment.reminderTimeList = this.reminderTimeList;
        this.requestUpdateCommentApi(this.reminderRelatedComment);
      }
    }
    this.reminderActionType = 'delete';
  }

  handleDelete(comment: Comment) {
    this.openModal = true;
    this.modalRelatedComment = comment;
    this.modalRelatedAction = this.handleDeleteAction.bind(this);
  }

  handleDeleteAction(e: CustomEvent) {
    if (e.detail.type === 'primary' && this.modalRelatedComment) {
      const childrenIds = ScCommentUtils.getAllChildCommentIds(
        this.modalRelatedComment.id,
        this.comments
      );
      const deleteIds = new Set([
        this.modalRelatedComment.id,
        ...childrenIds,
      ]);
      this.comments = this.comments.filter(comment => !deleteIds.has(comment.id));
      this.emitChange(this.comments);
      if (this.enableApi) {
        this.requestDeleteCommentApi(this.modalRelatedComment.id);
      }
    }
    this.openModal = false;
  }

  handleModalAction = (e: CustomEvent) => this.modalRelatedAction(e);

  // Event handler wrappers for sub-components
  handleFilterChange = async (e: CustomEvent) => {
    if (!this.manualSorting) {
      this.poster = e.detail.poster;
    }
    if (this.enableApi && !this.manualSorting) {
      this.resetParametersAndData();
      this.poster = e.detail.poster;
      const res:any = await this.requestGetCommentList();
      if ((res?.items ?? []).length >= 0) {
        this.requestPageNumber += 1;
      }
      this.requestUpdate();
    }
  };
  handleSortChange = async (e: CustomEvent) => {
    if (!this.manualSorting) {
      this.sorter = e.detail.sorter;
    }
    if (this.enableApi && !this.manualSorting) {
      this.resetParametersAndData();
      this.sorter = e.detail.sorter;
      const res:any = await this.requestGetCommentList();
      if ((res?.items ?? []).length >= 0) {
        this.requestPageNumber += 1;
      }
      this.requestUpdate();
    }
  };
  handleViewSortChange = (e: CustomEvent) => {
    this.poster = e.detail.poster;
    // Always forward sc-view-sort-change to the host (both client and server modes)
    this.emit('sc-view-sort-change', { detail: e.detail });
  };
  handleToggleRepliesEvent = (e: CustomEvent) =>
    this.handleToggleReplies(e.detail.commentId);
  handleHover = (e: CustomEvent) =>
    (this.hoveringCommentId = e.detail.commentId);
  handleHoverEnd = () => (this.hoveringCommentId = undefined);
  handleFileError = (e: CustomEvent) => this.emit('sc-file-error', e);

  handleLoadMore = async (e: CustomEvent) => {
    this.emit('sc-load-more', { detail: e.detail });
    if (this.enableApi) {
      this.loadMoreLoading = true;
      try {
        const res:any = await this.requestGetCommentList();
        if ((res?.items ?? []).length >= 0) {
          this.requestPageNumber += 1;
        }
      } finally {
        this.loadMoreLoading = false;
      }
    }
  };

  handleDeleteClick = (e: CustomEvent) => this.handleDelete(e.detail.comment);

  /**
   * Receives live typing updates from ScCommentList (compact mode) and stores
   * them into draftTexts so that an outside-click collapse can restore the text.
   */
  private handleCompactDraftChange = (e: CustomEvent) => {
    const { commentId, value } = e.detail ?? {};
    if (commentId !== undefined) {
      this.draftTexts.set(commentId, value ?? '');
    }
  };

  /**
   * Receives live typing updates from ScCommentInput (non-compact mode) and
   * stores them into draftTexts so that an outside-click collapse can restore
   * the text.
   */
  private handleNonCompactDraftChange = (e: CustomEvent) => {
    const { commentId, value } = e.detail ?? {};
    if (commentId !== undefined) {
      this.draftTexts.set(commentId, value ?? '');
      // Keep replyContent in sync so _collapseWithDraftPreserved captures it
      this.replyContent = value ?? '';
    }
  };

  handleActionTrigger(event: CustomEvent) {
    const { comment, value } = event.detail;

    if (value === 'delete') {
      this.handleDelete(comment);
    } else if (value === 'reminder') {
      this.openReminderModal(comment);
    } else if (value === 'mark') {
      this.openMarkModal(comment);
    } else {
      const custom = this.moreActions.find(action => action.id === value);
      if (custom) {
        custom.handler(comment);
      }
    }

    this.emit('sc-action-trigger', {
      detail: event.detail,
    });
  }

  handleAttachmentDownload = (e: CustomEvent) => {
    const { attachment } = e.detail;
    this.emit('sc-comment-file-download', { detail: { attachment } });
    const link = document.createElement('a');
    link.href = attachment.fileUrl;
    link.download = attachment.fileName;
    link.click();
  };

  handleAttachmentPreview = (e: CustomEvent<AttachmentPreviewDetail>) => {
    this.previewAttachment = e.detail.attachment;
    this.previewOpen = true;

    this.emit('sc-attachment-preview', {
      detail: e.detail,
    });
  };

  async loadUserInfo(e: CustomEvent) {
    const { comment, data } = e.detail;
    if (this.enableApi) {
      await this.updateComplete;
      this.comments = updateCommentById(this.comments, comment.id, {
        ...comment,
        user: {
          ...comment.user,
          name: data?.name ?? '',
        },
      }) as Comment[];
      this.requestUpdate();
    }
  }

  renderModal() {
    return html`<sc-modal
      .header=${msg('Delete comment', { id: 'sc-comment-delete-header' })}
      .footerType=${'button'}
      no-footer
      ?open=${this.openModal}
      @sc-hide=${this.handleModalClose}
    >
      ${msg('Are you sure you\'d like to delete this comment?', {
        id: 'sc-comment-delete-confirmation',
      })}
      <div slot="footer">
        <sc-button
          @click=${() =>
            this.modalRelatedAction(
              new CustomEvent('sc-action', { detail: { type: 'cancel' } })
            )}
          size="sm"
          type="secondary"
          >${msg('Cancel', { id: 'sc-comment-cancel' })}</sc-button
        >
        <sc-button
          @click=${() =>
            this.modalRelatedAction(
              new CustomEvent('sc-action', { detail: { type: 'primary' } })
            )}
          size="sm"
          state="error"
          style="margin-left: 0.5rem;"
          >${msg('Delete', { id: 'sc-comment-delete' })}</sc-button
        >
      </div>
    </sc-modal>`;
  }

  renderMarkModal() {
    const options = this.reminderConfig?.options?.length
      ? this.reminderConfig.options
      : [
          { label: msg('Need clarification', { id: 'sc-comment-status-need-clarification' }), value: 'need-clarification' },
          { label: msg('In progress', { id: 'sc-comment-status-in-progress' }), value: 'in-progress' },
          { label: msg('Resolved', { id: 'sc-comment-status-resolved' }), value: 'resolved' },
          { label: msg('Critical', { id: 'sc-comment-status-critical' }), value: 'critical' },
        ];
    const isSaveDisabled = !this.reminderStatus;

    return html`<sc-modal
      .header=${msg('Mark status', { id: 'sc-comment-mark-status-header' })}
      .footerType=${'button'}
      no-footer
      ?open=${this.markOpen}
      @sc-hide=${this.handleMarkClose}
    >
      <div style="display: flex; flex-direction: column; gap: 0.75rem;
      position: relative;
      ">
        <sc-dropdown-input
          style="--sc-popup-max-height:  18.75rem;"
          hoist
          size="md"
          ?required=${true}
          .data=${options}
          .value=${this.reminderStatus}
          @sc-select=${this.handleReminderStatusChange}
        >
          <span slot="label">
            ${msg('Mark status as', { id: 'sc-comment-mark-status-as' })}
          </span>
        </sc-dropdown-input>
      </div>
      <div slot="footer">
        <sc-button
          @click=${this.handleMarkClose}
          size="sm"
          type="secondary"
        >${msg('Cancel', { id: 'sc-comment-cancel' })}</sc-button>
        <sc-button
          @click=${this.handleReminderMarkNow}
          size="sm"
          ?disabled=${isSaveDisabled}
          style="margin-left: 0.5rem;"
        >${msg('Save', { id: 'sc-comment-save' })}</sc-button>
      </div>
    </sc-modal>`;
  }

  updateDisabledTimeOptions() {
    const isToday = this.reminderDate === dayjs().format('YYYY-MM-DD');
    const now = dayjs();
    let disabledHours: number[] = [];
    let disabledMinutes: number[] = [];
    let disabledSeconds: number[] = [];

    if (isToday) {
      const currentHour = now.hour();
      const currentMinute = now.minute();
      const currentSecond = now.second();

      disabledHours = Array.from({ length: currentHour }, (_, i) => i);

      const selectedHour = this.reminderTime ? parseInt(this.reminderTime.split(':')[0], 10) : NaN;
      const selectedMinute = this.reminderTime ? parseInt(this.reminderTime.split(':')[1], 10) : NaN;

      if (selectedHour === currentHour) {
        disabledMinutes = Array.from({ length: currentMinute }, (_, i) => i);
        if (selectedMinute === currentMinute) {
          disabledSeconds = Array.from({ length: currentSecond + 1 }, (_, i) => i);
        }
      }
    }
    this.disabledHours = disabledHours;
    this.disabledMinutes = disabledMinutes;
    this.disabledSeconds = disabledSeconds;
  }

  renderReminderModal() {
    const isSaveDisabled = !this.reminderDate || !this.reminderTime;

    return html`<sc-modal
      .header=${msg('Set reminder', { id: 'sc-comment-set-reminder' })}
      .footerType=${'button'}
      no-footer
      ?open=${this.reminderOpen}
      @sc-hide=${this.handleReminderClose}
    >
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <sc-date-input
          label=${msg('Due date', { id: 'sc-comment-set-reminder-due-date' })}
          hoist
          ?required=${true}
          .value=${this.reminderDate}
          placeholder=${'DD MM YYYY'}
          min=${dayjs().format('YYYY-MM-DD')}
          @sc-change=${this.handleReminderDateChange}
          @sc-input=${this.handleReminderDateChange}
          @sc-select=${this.handleReminderDateChange}
        ></sc-date-input>
        <sc-time-input
          hoist
          label=${msg('Due time', { id: 'sc-comment-set-reminder-due-time' })}
          ?required=${true}
          .value=${this.reminderTime}
          placeholder=${'HH:mm'}
          format="HH:mm"
          .disabledHours=${this.disabledHours}
          .disabledMinutes=${this.disabledMinutes}
          .disabledSeconds=${this.disabledSeconds}
          @sc-change=${this.handleReminderTimeChange}
          @sc-input=${this.handleReminderTimeChange}
          @sc-select=${this.handleReminderTimeChange}
          @sc-focus=${this.updateDisabledTimeOptions}
        ></sc-time-input>
        
        ${this.reminderTimeList.length > 0 ? html`
        <div class="reminder-time-list-header">
          <sc-divider vertical class="first-line"></sc-divider>
          <span>${msg('Reminders', { id: 'sc-comment-set-reminder-have-set' })}</span>
          <sc-divider vertical class="second-line"></sc-divider>
        </div>
        <div class="reminder-time-list-container">
          <div class="reminder-time-list-tags">
            ${this.reminderTimeList.map((entry: ReminderTimeEntry) => html`
              <sc-closable-tag
                type="grey"
                icon-name="timer-clock--line"
                @sc-remove=${() => this.handleReminderTimeListDelete(entry.id)}
              >
                ${dayjs(entry.time).format('DD MMM YYYY HH:mm')}
              </sc-closable-tag>
            `)}
          </div>
        </div>
      ` : nothing}
      </div>
      <div slot="footer">
        <sc-button
          @click=${this.handleReminderClose}
          size="sm"
          type="secondary"
        >${msg('Cancel', { id: 'sc-comment-cancel' })}</sc-button>
        <sc-button
          @click=${this.handleReminderConfirm}
          size="sm"
          ?disabled=${isSaveDisabled}
          style="margin-left: 0.5rem;"
        >${msg('Save', { id: 'sc-comment-save' })}</sc-button>
      </div>
    </sc-modal>`;
  }

  renderAttachmentPreviewModal() {
    if (!this.previewAttachment) return nothing;

    return html`<sc-modal
      .header=${this.previewAttachment.fileName}
      .footerType=${'button'}
      no-footer
      ?open=${this.previewOpen}
      @sc-hide=${this.handlePreviewClose}
    >
      <div style="display: flex; justify-content: center;">
        <img
          style="max-width: 100%; max-height: 70vh; object-fit: contain;"
          src=${this.previewAttachment.fileUrl}
          alt=${this.previewAttachment.fileName}
        />
      </div>
      <div slot="footer">
        <!-- <sc-button @click=${this.handlePreviewClose} size="sm">
          ${msg('Close', { id: 'sc-comment-preview-close' })}
        </sc-button> -->
      </div>
    </sc-modal>`;
  }

  renderToast() {
    return html`
      <div>
        ${this.successMessage || this.errorMessage ? html`
          <sc-toast type=${this.errorMessage ? 'error' : 'success'} closable="" placement="top-right" duration="3000" open
          @sc-hide=${()=>{ this.errorMessage = ''; this.successMessage = ''; }}
          >
            ${this.errorMessage}
            ${this.successMessage}
          </sc-toast>
        ` : nothing}
      </div>
    `;
  }

  render() {
    const comments = this.manualSorting
      ? ScCommentUtils.finalizedComments(
          this.comments,
          'all',   // no poster filter
          'none',  // no sort
          this.userInfo.bankid,
          {},
          {}
        )
      : ScCommentUtils.finalizedComments(
          this.comments,
          this.poster,
          this.sorter,
          this.userInfo.bankid,
          this.posterFilters,
          this.sorterComparators
        );

    return html`
      <!-- Root input for new comments (hidden in readonly mode) -->
      ${this.readonly
        ? nothing
        : html`
          <sc-comment-input
            .userInfo=${this.userInfo}
            mode="post"
            .value=${this.value}
            .toolbar=${this.toolbar}
            .fileHandler=${this.fileHandler}
            .enableUpload=${this.enableUpload}
            .singleFileUpload=${this.singleFileUpload}
            .maxFilesPerComment=${this.maxFilesPerComment}
            .acceptedFileTypes=${this.acceptedFileTypes}
            ?compact=${this.compact}
            ?hideAvatar=${this.hideAvatar}
            @sc-submit=${this.handlePost}
            @sc-files-change=${(e: CustomEvent) =>
              this.handleFileSelection(e, 'root')}
            @sc-file-error=${this.handleFileError}
            @sc-attachment-preview=${this.handleAttachmentPreview}
          ></sc-comment-input>
        `}

      <!-- Toolbar for filtering and sorting -->
      <sc-comment-toolbar
        .commentCount=${comments.length}
        .currentPoster=${this.poster}
        .currentSorter=${this.sorter}
        .viewOptions=${this.effectivePosterOptions}
        .sortOptions=${this.effectiveSorterOptions}
        .manualSorting=${this.manualSorting}
        .hideViewCondition=${this.hideViewCondition}
        .hideSortBy=${this.hideSortBy}
        ?compact=${this.compact}
        @sc-filter-change=${this.handleFilterChange}
        @sc-sort-change=${this.handleSortChange}
        @sc-view-sort-change=${this.handleViewSortChange}
      ></sc-comment-toolbar>

      <!-- Comment list -->
      <sc-comment-list
        .comments=${comments}
        .singleRequestComments=${this.singleRequestComments}
        .requestPageSize=${this.requestPageSize}
        .requestPageNumber=${this.requestPageNumber}
        .userInfo=${this.userInfo}
        .maxReplyDepth=${this.maxRepliesdepth}
        .maxVisibleReplies=${this.maxVisibleReplies}
        .enableLike=${this.enableLike}
        .enableShare=${this.enableShare}
        .enableReport=${this.enableReport}
        .enableEdit=${this.enableEdit}
        .enableDelete=${this.enableDelete}
        .disableFileDownload=${this.disableFileDownload}
        ?enableReminder=${this.enableReminder}
        ?enableMark=${this.enableMark}
        ?hideAvatar=${this.hideAvatar}
        ?requestLoading=${this.requestLoading}
        .actions=${this.actions}
        .moreActions=${this.moreActions}
        .activeCommentId=${this.activeComment?.id}
        .activeEditCommentId=${this.activeEditComment?.id}
        .repliesExpanded=${this.repliesExpanded}
        .hoveringCommentId=${this.hoveringCommentId}
        .fileHandler=${this.fileHandler}
        .enableUpload=${this.enableUpload}
        .singleFileUpload=${this.singleFileUpload}
        .maxFilesPerComment=${this.maxFilesPerComment}
        .acceptedFileTypes=${this.acceptedFileTypes ?? ''}
        .replyInputValue=${this.replyContent}
        .draftTexts=${Object.fromEntries(this.draftTexts)}
        .toolbar=${this.toolbar}
        ?compactReplyMode=${this.compactReplyMode}
        .readonly=${this.readonly}
        ?compact=${this.compact}
        ?loadMoreLoading=${this.loadMoreLoading}
        @sc-reply=${this.handleReplyClick}
        @sc-edit=${this.handleEditClick}
        @sc-delete-request=${this.handleDeleteClick}
        @sc-comment-like=${this.handleLikeClick}
        @sc-comment-share=${this.handleShareClick}
        @sc-comment-report=${this.handleReportClick}
        @sc-toggle-replies=${this.handleToggleRepliesEvent}
        @sc-action-trigger=${this.handleActionTrigger}
        @sc-hover=${this.handleHover}
        @sc-hover-end=${this.handleHoverEnd}
        @sc-attachment-download=${this.handleAttachmentDownload}
        @sc-attachment-preview=${this.handleAttachmentPreview}
        @sc-userinfo-load=${this.loadUserInfo}
        @sc-submit=${this.handleReply}
        @sc-cancel=${this.handleCancel}
        @sc-close=${this.handleClose}
        @sc-compact-draft-change=${this.handleCompactDraftChange}
        @sc-draft-change=${this.handleNonCompactDraftChange}
        @sc-files-change=${(e: CustomEvent) =>
          this.handleFileSelection(e, this.activeComment?.id || this.activeEditComment?.id || '')}
        @sc-file-error=${this.handleFileError}
        @sc-load-more=${this.handleLoadMore}
      ></sc-comment-list>

      ${this.renderModal()}
      ${this.renderReminderModal()}
      ${this.renderMarkModal()}
      ${this.renderAttachmentPreviewModal()}
      ${this.renderToast()}
    `;
  }
}
