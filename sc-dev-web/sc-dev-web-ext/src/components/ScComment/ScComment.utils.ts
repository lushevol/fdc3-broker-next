import type { Comment } from './ScComment.types.js';
import type { CommentAttachment } from './types/comment-attachment.js';
import dayjs from 'dayjs/esm/index.js';

/**
 * Utility class for comment-related operations
 */
export class ScCommentUtils {
  private static getCommentTimestamp(comment: Comment & { createdDate?: string }): number {
    const candidate = comment.createdAt ?? comment.createdDate;

    if (
      candidate instanceof Date ||
      typeof candidate === 'number' ||
      typeof candidate === 'string'
    ) {
      const timestamp = dayjs(candidate).valueOf();
      return Number.isFinite(timestamp) ? timestamp : 0;
    }

    return 0;
  }

  /**
   * Get all child comment IDs recursively
   * @param commentId Parent comment ID
   * @param comments All comments array
   * @returns Array of child comment IDs
   */
  static getAllChildCommentIds(
    commentId: string,
    comments: Comment[]
  ): string[] {
    const childIds: string[] = [];
    const stack = comments.filter(c => c.parentID === commentId).map(c => c.id);

    while (stack.length) {
      const currentId = stack.pop();
      if (!currentId) continue;
      childIds.push(currentId);
      const children = comments
        .filter(c => c.parentID === currentId)
        .map(c => c.id);
      stack.push(...children);
    }

    return childIds;
  }


  /**
   * Convert File to CommentAttachment
   * @param file File object
   * @param index File index
   * @param uploadedBy User bankid
   * @param commentId Comment ID
   * @returns CommentAttachment object
   */
  static fileToAttachment(
    file: File,
    index: number,
    uploadedBy: string,
    commentId: string
  ): CommentAttachment {
    return {
      id: `${Date.now()}-${index}`,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileUrl: URL.createObjectURL(file),
      uploadedBy,
      uploadedAt: new Date(),
      commentId,
    };
  }

  /**
   * Finalize comments with filtering and sorting
   * @param comments Comments array
   * @param poster Filter by poster
   * @param sorter Sort order
   * @param userBankid Current user bankid
   * @returns Finalized comment tree
   */
  static finalizedComments(
    comments: Comment[] | undefined,
    poster: string,
    sorter: string,
    userBankid: string,
    posterFilters: Record<string, (comment: Comment, userBankid: string) => boolean> = {},
    sorterComparators: Record<string, (a: Comment, b: Comment) => number> = {}
  ): any[] {
    if (!comments) return [];
    const commentMap = new Map<string, any>();
    const roots: any[] = [];
    const filtered = comments.filter(comment => {
      const customFilter = posterFilters[poster];
      if (customFilter) {
        return customFilter(comment, userBankid);
      }

      if (poster === 'me' || poster === 'mine') {
        return comment.user.bankid === userBankid;
      }

      return true;
    });

    const normalizedSorter = sorter === 'most-replies' ? 'most' : sorter;
    const customComparator = sorterComparators[sorter] || sorterComparators[normalizedSorter];

    if (customComparator) {
      filtered.sort(customComparator);
    } else if (normalizedSorter === 'newest') {
      filtered.sort(
        (a, b) =>
          ScCommentUtils.getCommentTimestamp(b as Comment & { createdDate?: string }) -
          ScCommentUtils.getCommentTimestamp(a as Comment & { createdDate?: string })
      );
    } else if (normalizedSorter === 'oldest') {
      filtered.sort(
        (a, b) =>
          ScCommentUtils.getCommentTimestamp(a as Comment & { createdDate?: string }) -
          ScCommentUtils.getCommentTimestamp(b as Comment & { createdDate?: string })
      );
    } else if (normalizedSorter === 'most') {
      const replyCountMap = new Map<string, number>();
      for (const comment of filtered) {
        if (comment.parentID) {
          replyCountMap.set(
            comment.parentID,
            (replyCountMap.get(comment.parentID) || 0) + 1
          );
        }
      }
      filtered.sort(
        (a, b) => (replyCountMap.get(b.id) || 0) - (replyCountMap.get(a.id) || 0)
      );
    }

    for (const comment of filtered) {
      commentMap.set(comment.id, { ...comment, replies: [] });
    }

    for (const comment of filtered) {
      if (comment.parentID && commentMap.has(comment.parentID)) {
        const parent = commentMap.get(comment.parentID);
        const child = commentMap.get(comment.id);
        if (parent && child) {
          parent.replies.push(child);
        }
      } else {
        const root = commentMap.get(comment.id);
        if (root) {
          roots.push(root);
        }
      }
    }

    return roots;
  }
}
