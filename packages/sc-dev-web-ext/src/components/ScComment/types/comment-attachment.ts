/**
 * Type definitions for comment file attachments
 * 
 * @module comment-attachment
 */

/**
 * Represents a file attached to a comment or reply
 */
export interface CommentAttachment {
  /** Unique identifier for the attachment */
  id: string;
  
  /** Original file name (sanitized) */
  fileName: string;
  
  /** File size in bytes */
  fileSize: number;
  
  /** MIME type (e.g., "image/png", "application/pdf") */
  fileType: string;
  
  /** URL to download the file (provided by backend) */
  fileUrl: string;
  
  /** User bankid who uploaded the file */
  uploadedBy: string;
  
  /** Timestamp when file was uploaded */
  uploadedAt: Date | string;
  
  /** ID of the comment/reply this attachment belongs to */
  commentId: string;

  /** Optional thumbnail/preview URL for images */
  previewUrl?: string;

  /** Optional flag to hint image preview support */
  isImage?: boolean;
}

/**
 * Temporary state for attachments before comment is posted
 */
export interface DraftAttachment {
  /** Browser File object */
  file: File;
  
  /** Temporary client-side ID (for tracking during draft) */
  id: string;
  
  /** ID of draft comment/reply (could be 'root' for new comment) */
  commentId: string;
}
