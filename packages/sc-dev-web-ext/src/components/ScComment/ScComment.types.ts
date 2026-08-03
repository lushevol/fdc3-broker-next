import type { CommentAttachment } from './types/comment-attachment.js';
import type { TemplateResult } from 'lit';

/**
 * User information interface
 */
export interface UserInfo {
  bankid: string;
  name: string;
  avatarUrl?: string;
}

/**
 * Comment interface
 */
export interface ReminderTimeEntry {
  id: string;
  time: string;
}

export interface Comment {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt?: Date;
  user: UserInfo;
  parentID?: string;
  likes?: number;
  likedByCurrentUser?: boolean;
  saved?: boolean;
  reported?: boolean;
  emited?: boolean;
  attachments?: CommentAttachment[];
  status?: 'need-clarification' | 'in-progress' | 'resolved' | 'critical';
  targetStatus?: string,
  reminderAt?: Date | string;
  reminderTimeList?: ReminderTimeEntry[];
  mentions?: Array<{ id: string; name: string }>;
}

/**
 * Comment with nested replies
 */
export type CommentBaseDemand = Comment & { replies: CommentBaseDemand[] };

/**
 * Comment model class with constructor
 */
export class CommentModel implements Comment {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt?: Date;
  user: UserInfo;
  parentID?: string;
  likes?: number;
  likedByCurrentUser?: boolean;
  saved?: boolean;
  reported?: boolean;
  attachments?: CommentAttachment[];
  status?: 'need-clarification' | 'in-progress' | 'resolved' | 'critical';
  reminderAt?: Date;
  mentions?: Array<{ id: string; name: string }>;

  constructor(
    data: Omit<Comment, 'createdAt'> & { createdAt?: Date | string }
  ) {
    this.id = data.id;
    this.text = data.text;
    this.createdAt =
      typeof data.createdAt === 'string'
        ? new Date(data.createdAt)
        : data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt;
    this.user = data.user;
    this.parentID = data.parentID;
    this.likes = data.likes;
    this.likedByCurrentUser = data.likedByCurrentUser;
    this.saved = data.saved;
    this.reported = data.reported;
    this.attachments = data.attachments;
    this.status = data.status;
    this.reminderAt =
      typeof data.reminderAt === 'string'
        ? new Date(data.reminderAt)
        : data.reminderAt;
    this.mentions = data.mentions;
  }
}

/**
 * Custom action type
 */
export type Action = {
  icon: string;
  label: string;
  handler: (comment: CommentBaseDemand) => void;
};

export type ActionLabel = string | ((comment: CommentBaseDemand) => TemplateResult | string);

export type CommentAction = {
  id: string;
  label: string;
  icon?: string;
  handler: (comment: CommentBaseDemand) => void;
};

export type ToolbarOption = {
  label: string;
  value: string;
};

export type ReminderConfig = {
  options: ToolbarOption[];
  defaultStatus: 'need-clarification' | 'in-progress' | 'resolved' | 'critical';
};

export type ReminderTriggerDetail = {
  commentId: string;
  scheduledAt: string;
  targetStatus: 'need-clarification' | 'in-progress' | 'resolved' | 'critical';
};

export type AttachmentPreviewDetail = {
  commentId: string;
  attachment: CommentAttachment;
};

/**
 * Abstract fields for ScComment component
 */
export abstract class ScCommentFields {
  abstract maxRepliesdepth: number;
  abstract maxVisibleReplies: number;
  abstract enableLike: boolean;
  abstract enableShare: boolean;
  abstract enableReport: boolean;
  abstract userInfo: UserInfo;
  abstract comments?: Comment[];
  abstract actions: Action[];
}
