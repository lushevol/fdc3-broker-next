import dayjs from 'dayjs/esm/index.js';
import type { CommentBaseDemand } from '../ScComment.types.js';

export const findCommentById = (comments: Partial<CommentBaseDemand>[], id: string): Partial<CommentBaseDemand> | null => {
    for (const comment of comments) {
        if (comment.id === id) {
            return comment;
        }
        if (comment.replies && comment.replies.length > 0) {
            const found = findCommentById(comment.replies, id);
            if (found) {
                return found;
            }
        }
    }
    return null;
};

export const updateCommentById = (comments: Partial<CommentBaseDemand>[], id: string, updated: Partial<CommentBaseDemand>): Partial<CommentBaseDemand>[] => {
    const updatedComments: Partial<CommentBaseDemand>[] = [];
    for (const comment of comments) {
        if (comment.id === id) {
            updatedComments.push(updated);
        } else {
            const updatedReplies = updateCommentById(comment.replies || [], id, updated);
            if (updatedReplies) {
                updatedComments.push({ ...comment, replies: updatedReplies as [] });
            } else {
                updatedComments.push(comment);
            }
        }
    }
    return updatedComments;
};

export const transformCommentsData = (items: any[], comments: Partial<CommentBaseDemand>[]) => {
    const rootComments: any[] = [];
    items.forEach(comment => {
        const findComment:any = findCommentById(comments, comment.id);
        comment.user = {
            ...(findComment?.user || {}),
            bankid: comment.userId, 
        };
        comment.createdAt = dayjs(comment.createdDate).toDate();
        comment.updatedAt = dayjs(comment.updatedDate).toDate();
        comment.text = comment.content;
        comment.parentID = comment.parentId ?? null;
        // transform reminderAt and reminderTimeList
        comment.reminderAt = (comment.reminderTimeList ?? []).length > 0 ? dayjs(comment.reminderTimeList[0]).format('YYYY-MM-DD HH:mm') : null;
        comment.reminderTimeList = (comment.reminderTimeList ?? []).map((time: string) => ({
            id: crypto.randomUUID(),
            time: dayjs(time).format('YYYY-MM-DD HH:mm'),
        }));
        if (!(comment.mentions ?? [])[0]?.id) {
            comment.mentions = (comment.mentions ?? []).map((bankid: string) => ({
                id: bankid,
                name: '', 
            }));
        }
        rootComments.push(comment);
    });
    return rootComments;
};

export const isElementVisible = (el: Element | null): el is HTMLElement => {
    if (!(el instanceof HTMLElement)) return false;
    const style = window.getComputedStyle(el);
    return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    el.getClientRects().length > 0
    );
};