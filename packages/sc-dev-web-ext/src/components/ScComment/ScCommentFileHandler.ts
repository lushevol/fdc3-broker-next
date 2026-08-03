import type { Comment } from './ScComment.types.js';
import { validateFileType } from './utils/file-utils.js';

/**
 * File handler for ScComment component
 * Manages draft attachments, validation, and file operations
 */
export class ScCommentFileHandler {
  private draftAttachments = new Map<string, File[]>();
  private attachmentErrors = new Map<string, string>();
  private deletedAttachmentIds = new Set<string>();
  private fileInputKeys = new Map<string, number>();
  private lastFileCount = new Map<string, number>();

  constructor(
    private maxFilesPerComment: number,
    private acceptedFileTypes?: string
  ) {}

  /**
   * Get draft attachments for a comment
   */
  getDraftAttachments(commentId: string): File[] {
    return this.draftAttachments.get(commentId) || [];
  }

  /**
   * Get attachment error for a comment
   */
  getAttachmentError(commentId: string): string | undefined {
    return this.attachmentErrors.get(commentId);
  }

  /**
   * Clear attachment error for a comment
   */
  clearAttachmentError(commentId: string): void {
    this.attachmentErrors.delete(commentId);
  }

  /**
   * Get deleted attachment IDs
   */
  getDeletedAttachmentIds(): Set<string> {
    return this.deletedAttachmentIds;
  }

  /**
   * Get file input key for a comment (for forcing re-render)
   */
  getFileInputKey(commentId: string): number {
    return this.fileInputKeys.get(commentId) || 0;
  }

  /**
   * Clear all draft attachments and errors for a comment
   */
  clearDrafts(commentId: string): void {
    this.draftAttachments.delete(commentId);
    this.attachmentErrors.delete(commentId);
  }

  /**
   * Clear deleted attachment IDs
   */
  clearDeletedIds(): void {
    this.deletedAttachmentIds.clear();
  }

  /**
   * Mark attachment as deleted (for edit mode)
   */
  markAttachmentDeleted(attachmentId: string): void {
    this.deletedAttachmentIds.add(attachmentId);
  }
  /**
   * Check if an attachment is marked as deleted
   */
  isAttachmentDeleted(attachmentId: string): boolean {
    return this.deletedAttachmentIds.has(attachmentId);
  }
  /**
   * Set file input key to force re-render
   */
  setFileInputKey(commentId: string, key: number): void {
    this.fileInputKeys.set(commentId, key);
  }

  /**
   * Increment file input key to force re-render
   */
  incrementFileInputKey(commentId: string): void {
    const currentKey = this.fileInputKeys.get(commentId) || 0;
    this.fileInputKeys.set(commentId, currentKey + 1);
  }

  /**
   * Reset file input (increment key to force re-render)
   */
  resetFileInput(commentId: string, callback: () => void): void {
    // Simply increment the key to force a clean re-render
    const currentKey = this.fileInputKeys.get(commentId) || 0;
    this.fileInputKeys.set(commentId, currentKey + 1);
    callback();
  }

  /**
   * Handle file selection from sc-file-input
   * @returns Object with validation result and error details
   */
  handleFileSelection(
    files: FileList | undefined,
    commentId: string,
    activeEditComment: Comment | null
  ): {
    success: boolean;
    errorType?: string;
    errorMessage?: string;
    fileCount?: number;
    fileNames?: string[];
    draftFiles?: File[];
  } {
    const isEditMode = activeEditComment?.id === commentId;

    if (!files || files.length === 0) {
      // User cleared all files
      // In edit mode, mark all remaining existing attachments as deleted
      if (isEditMode && activeEditComment) {
        const existingAttachments =
          activeEditComment.attachments?.filter(
            att => !this.deletedAttachmentIds.has(att.id)
          ) || [];
        
        existingAttachments.forEach(att => {
          this.deletedAttachmentIds.add(att.id);
        });
      }
      
      this.draftAttachments.delete(commentId);
      this.attachmentErrors.delete(commentId);
      return { success: true };
    }

    const allFiles = Array.from(files);

    // In edit mode, sc-file-input contains: [existing attachments metadata..., draft File objects...]
    // We need to detect deletions and extract only new draft files
    let draftFiles: File[] = [];

    if (isEditMode && activeEditComment) {
      const existingAttachments =
        activeEditComment.attachments?.filter(
          att => !this.deletedAttachmentIds.has(att.id)
        ) || [];
      
      const currentDrafts = this.draftAttachments.get(commentId) || [];
      
      // Build current state file names
      const currentFileNames = [
        ...existingAttachments.map(att => att.fileName),
        ...currentDrafts.map(f => f.name),
      ];
      
      const newFileNames = allFiles.map((f: any) => f.name);
      
      // Detect deletions: files in current but not in new
      currentFileNames.forEach((fileName, index) => {
        if (!newFileNames.includes(fileName)) {
          if (index < existingAttachments.length) {
            // Deleted existing attachment
            const deletedAtt = existingAttachments[index];
            this.deletedAttachmentIds.add(deletedAtt.id);
          }
        }
      });
      
      // Extract only File objects (new drafts) from allFiles
      const existingFileNames = new Set(existingAttachments.map(att => att.fileName));
      draftFiles = allFiles.filter(
        (f: any) => f instanceof File && !existingFileNames.has(f.name)
      ) as File[];
    } else {
      // Not in edit mode, all files are draft files
      draftFiles = allFiles.filter((f: any) => f instanceof File) as File[];
    }

    // Clear any previous errors
    this.attachmentErrors.delete(commentId);

    // Calculate total file count (remaining existing + draft files)
    const remainingExistingCount =
      isEditMode && activeEditComment
        ? (activeEditComment.attachments?.filter(
            att => !this.deletedAttachmentIds.has(att.id)
          ) || []).length
        : 0;
    const totalFileCount = remainingExistingCount + draftFiles.length;

    // Validate total file count
    if (totalFileCount > this.maxFilesPerComment) {
      const errorMsg = `Maximum ${this.maxFilesPerComment} files per comment`;
      this.attachmentErrors.set(commentId, errorMsg);
      return {
        success: false,
        errorType: 'MAX_FILES_EXCEEDED',
        errorMessage: errorMsg,
        fileCount: totalFileCount,
      };
    }

    // Validate file types for draft files only
    const invalidFiles = draftFiles.filter(
      file => !validateFileType(file, this.acceptedFileTypes)
    );
    if (invalidFiles.length > 0) {
      // Log validation failure details for debugging
      console.warn('File type validation failed:', {
        acceptedTypes: this.acceptedFileTypes,
        invalidFiles: invalidFiles.map(f => ({
          name: f.name,
          type: f.type,
          size: f.size,
        })),
      });
      
      const errorMsg = 'Invalid file type';
      this.attachmentErrors.set(commentId, errorMsg);
      return {
        success: false,
        errorType: 'INVALID_FILE_TYPE',
        errorMessage: errorMsg,
        fileCount: invalidFiles.length,
        fileNames: invalidFiles.map(f => f.name),
      };
    }

    // Replace (not append) draft files
    if (draftFiles.length > 0) {
      this.draftAttachments.set(commentId, draftFiles);
    } else {
      this.draftAttachments.delete(commentId);
    }

    return { success: true, draftFiles };
  }

  /**
   * Remove draft attachment by index
   */
  removeDraftAttachment(commentId: string, fileIndex: number): boolean {
    const files = this.draftAttachments.get(commentId);
    if (!files) return false;

    const updated = files.filter((_, index) => index !== fileIndex);
    if (updated.length === 0) {
      this.draftAttachments.delete(commentId);
      this.attachmentErrors.delete(commentId);
    } else {
      this.draftAttachments.set(commentId, updated);
    }

    return true;
  }



  /**
   * Calculate total file count including existing attachments
   */
  calculateTotalFileCount(
    commentId: string,
    activeEditComment: Comment | null
  ): number {
    const currentFiles = this.draftAttachments.get(commentId) || [];
    let totalFileCount = currentFiles.length;

    const isEditMode = activeEditComment?.id === commentId;
    if (isEditMode && activeEditComment) {
      const existingCount =
        (activeEditComment.attachments?.filter(
          att => !this.deletedAttachmentIds.has(att.id)
        ) || []).length;
      totalFileCount += existingCount;
    }

    return totalFileCount;
  }

  /**
   * Check if file limit is reached
   */
  isLimitReached(commentId: string, activeEditComment: Comment | null): boolean {
    return (
      this.calculateTotalFileCount(commentId, activeEditComment) >=
      this.maxFilesPerComment
    );
  }

  /**
   * Prepare file input value for edit mode (existing attachments + draft files)
   * Returns mixed array for sc-file-input display
   */
  prepareFileInputValue(
    commentId: string,
    activeEditComment: Comment | null
  ):
    | Array<{name: string; size: number; selectable: boolean; deletable: boolean} | File>
    | undefined {
    const isEditMode = activeEditComment?.id === commentId;
    
    if (isEditMode && activeEditComment) {
      // Edit mode: return existing attachments + draft files
      const existingAttachments =
        activeEditComment.attachments?.filter(
          att => !this.deletedAttachmentIds.has(att.id)
        ) || [];

      const currentFiles = this.draftAttachments.get(commentId) || [];

      // Build combined list: existing attachments (as metadata) + draft files (as File objects)
      const existingFilesList = existingAttachments.map(att => ({
        name: att.fileName,
        size: att.fileSize,
        selectable: false,
        deletable: true,
      }));

      // Return combined array: metadata objects + File objects
      const combined = [...existingFilesList, ...currentFiles];
      return combined.length > 0 ? combined : undefined;
    } else {
      // Post/Reply mode: return only draft files
      const currentFiles = this.draftAttachments.get(commentId) || [];
      return currentFiles.length > 0 ? currentFiles : undefined;
    }
  }
}
